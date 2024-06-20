import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { findWithPagination } from '../utils/find-with-pagination';
import { uploadFromUrl } from '../utils/gcs';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { CardListQueryOptionsDto } from './dto/card-list-query-options.dto';
import { CardSequence } from './entities/card-sequence.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { loadCardSequenceToRedis } from '../utils/cache';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    private configService: ConfigService,
    @InjectRepository(CardSequence)
    private cardSequenceRepository: Repository<CardSequence>,
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRedis() private redis: Redis,
  ) {}
  async create(createCardDto: CreateCardDto) {
    const card = this.cardRepository.create(createCardDto);
    await this.cardRepository.insert(card);
    return card;
  }

  async findAll(options: CardListQueryOptionsDto) {
    const { collectionId, grade, name, status, pickup, ...rest } = options;
    return findWithPagination(this.cardRepository, {
      ...rest,
      where: {
        ...(collectionId ? { collectionId } : {}),
        ...(grade ? { grade } : {}),
        ...(name ? { name: Like(`%${name}%`) } : {}),
        ...(status ? { status } : {}),
        ...(pickup ? { pickup } : {})
      },
    });
  }

  async findOne(id: string) {
    return this.cardRepository.findOneBy({ id });
  }

  async update(id: string, updateCardDto: UpdateCardDto) {
    this.cardRepository.update(id, updateCardDto);
  }

  async remove(id: string) {
    return this.cardRepository.softDelete(id);
  }

  async generateStatus(collectionId: string): Promise<number> {
    return this.cardSequenceRepository.countBy({ collectionId });
  }
  async generateStatusMultiple(idList: string[]): Promise<
    {
      collectionId: string;
      cnt: string;
      processed: string;
    }[]
  > {
    return await this.cardSequenceRepository
      .createQueryBuilder('card_sequence')
      .select('card_sequence.collectionId', 'collectionId')
      .addSelect('COUNT(1)', 'cnt')
      .addSelect('SUM(card_sequence.processed)', 'processed')
      .where('card_sequence.collectionId IN (:...idList) ', { idList })
      .groupBy('card_sequence.collectionId')
      .getRawMany();
  }
  async randomlizeCard(collectionId: string) {
    await this.dataSource.query(
      `delete from card_sequence where collectionId = '${collectionId}';`,
    );
    await this.dataSource.query(
      `
      INSERT INTO card_sequence (id, cardId, collectionId, seq, processed)
      WITH numberedCards AS (
        SELECT
          card.id,
          card.collectionId,
          numbers.num,
          initialInventory,
          appearance,
          ROW_NUMBER() OVER (ORDER BY rand()) AS row1
        FROM card
        JOIN numbers ON numbers.num >= 1 AND numbers.num <= card.initialInventory
        WHERE card.collectionId = '${collectionId}'
        AND deletedAt IS NULL
        AND appearance = 0
        AND status = 'active'
        order by row1
      ), numberedNumbers AS (
        SELECT
        num,
        ROW_NUMBER() OVER (ORDER BY num) AS row1
      FROM numbers 
      WHERE num NOT IN
      (SELECT appearance from card WHERE card.collectionId = '${collectionId}' AND deletedAt IS NULL AND appearance > 0 AND status = 'active')
      AND num  > 0
      ORDER BY num
      )
      SELECT
        uuid() as id,
        numberedCards.id as cardId,
        numberedCards.collectionId,
        numberedNumbers.num as seq,
        0 as processed
      FROM numberedCards
      JOIN numberedNumbers ON numberedNumbers.row1 = numberedCards.row1
      UNION
      SELECT
        uuid() as id,
        card.id as cardId,
        card.collectionId as collectionId,
        appearance as seq,
        0 as processed
      FROM card
      WHERE card.collectionId = '${collectionId}'
      AND deletedAt IS NULL
      AND appearance > 0
      AND status = 'active'
      ORDER BY seq;
      `,
    );
    const cardSequenceList = await this.cardSequenceRepository.find({
      where: {
        collectionId: collectionId,
        processed: 0,
      },
      order: {
        seq: 'ASC',
      },
    });
    const sequenceIdList: string[] = cardSequenceList.map((cardSequence) => cardSequence.id);
    await loadCardSequenceToRedis(this.redis, collectionId, sequenceIdList);
  }
  
  async resetCollectionStatus(collectionId: string) {
    await this.cardRepository
      .createQueryBuilder()
      .update(Card)
      .set({ inventory: () => 'initialInventory' })
      .where('collectionId = :collectionId', { collectionId })
      .execute();
  }
  async fetchAndUpload(
    collectionId: string,
    cardList: { href: string; text: string }[],
  ) {
    const storage = new Storage({
      projectId: this.configService.get<string>('gcp.projectId'),
      credentials: {
        client_email: this.configService.get<string>('gcp.clientEmail'),
        private_key: this.configService.get<string>('gcp.privateKey'),
      },
    });
    const result = [];
    const bucketNane = this.configService.get<string>('gcp.bucketName');
    for (const card of cardList) {
      const suffix = card.href.split('.').reverse()[0];
      const cardName = `${card.text}.${suffix}`;
      const { url } = await uploadFromUrl(
        storage,
        bucketNane,
        cardName,
        card.href,
      );
      const cardEntity = this.cardRepository.create({
        name: card.text,
        description: card.text,
        points: 0,
        grade: '4',
        thumbnail: url,
        collectionId,
        inventory: 0,
        initialInventory: 0,
        status: 'inactive',
      });
      await this.cardRepository.insert(cardEntity);
      result.push(cardEntity);
    }
    return result;
  }
  async findCollectionProgress(idList: string[]): Promise<
    {
      collectionId: string;
      inventory: number;
      initialInventory: number;
      progress: number;
    }[]
  > {
    return this.cardRepository
      .createQueryBuilder('card')
      .select('card.collectionId', 'collectionId')
      .addSelect('SUM(card.inventory)', 'inventory')
      .addSelect('SUM(card.initialInventory)', 'initialInventory')
      .addSelect(
        'SUM(card.inventory) * 1. / SUM(card.initialInventory)',
        'progress',
      )
      .where('card.collectionId IN (:...idList) ', { idList })
      .groupBy('card.collectionId')
      .getRawMany();
  }
}
