import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { findWithPagination } from '../utils/find-with-pagination';
import { uploadFromUrl } from '../utils/gcs';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { CardListQueryOptionsDto } from './dto/card-list-query-options.dto';
import { CreateCardToOripaDto } from './dto/create-card-to-oripa.dto';
import { CardToOripaEntity } from './entities/card-to-oripa.entity';
import { UpdateCardToOripaDto } from './dto/update-card-to-oripa.dto';
import { CardSequence } from './entities/card-sequence.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { loadCardSequenceToRedis } from '../utils/cache';
import { Paginated } from '@common-utils/types';
import { PaginatedResponse } from '../dto/paginated-response.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(CardToOripaEntity)
    private cardToOripaRepository: Repository<CardToOripaEntity>,
    @InjectRepository(CardSequence)
    private cardSequenceRepository: Repository<CardSequence>,
    private configService: ConfigService,
    private dataSource: DataSource,
    @InjectRedis() private redis: Redis,
  ) {}
  async create(createCardDto: CreateCardDto) {
    const card = this.cardRepository.create(createCardDto);
    await this.cardRepository.insert(card);
    return card;
  }

  async findAll(options: CardListQueryOptionsDto) {
    const { collectionId, grade, name, status, ...rest } = options;
    return findWithPagination(this.cardRepository, {
      ...rest,
      where: {
        ...(name ? { name: Like(`%${name}%`) } : {}),
        ...(status ? { status } : {}),
      },
    });
  }

  async findAllCardToOripaEntity(
    collectionId: string,
    options: CardListQueryOptionsDto,
  ): Promise<PaginatedResponse<CardToOripaEntity>> {
    const { grade, name, status, ...rest } = options;
    return findWithPagination(this.cardToOripaRepository, {
      ...rest,
      where: {
        ...(collectionId ? { collectionId } : {}),
        ...(grade ? { grade } : {}),
        ...(name ? { name: Like(`%${name}%`) } : {}),
        ...(status ? { status } : {}),
      },
      relations: ['card', 'collection'],
    });
  }

  async createCardToOripaEntity(
    cardId: string,
    collectionId: string,
    createCardToOripaDto: CreateCardToOripaDto,
  ) {
    const cardToOripa = this.cardToOripaRepository.create({
      cardId,
      collectionId,
      ...createCardToOripaDto,
    });
    return await this.cardToOripaRepository.save(cardToOripa);
  }
  async updateCardToOripaEntity(
    id: string,
    updateCardToOripaDto: UpdateCardToOripaDto,
  ) {
    return await this.cardToOripaRepository.update(id, updateCardToOripaDto);
  }
  async deleteCardToOripaEntity(id: string) {
    return await this.cardToOripaRepository.softDelete(id);
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
    return this.cardSequenceRepository
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
      INSERT INTO card_sequence (id, cardToOripaId, cardId, collectionId,  seq, processed)
      WITH numberedCards AS (
        SELECT
          cc.id,
          cc.cardId,
          cc.collectionId,
          numbers.num,
          initialInventory,
          appearance,
          ROW_NUMBER() OVER (ORDER BY rand()) AS row1
        FROM card_collections_collection cc
        JOIN numbers ON numbers.num >= 1 AND numbers.num <= cc.initialInventory
        WHERE cc.collectionId = '${collectionId}'
        AND deletedAt IS NULL
        AND appearance = 0
        order by row1
      ), numberedNumbers AS (
        SELECT
        num,
        ROW_NUMBER() OVER (ORDER BY num) AS row1
      FROM numbers
      WHERE num NOT IN
      (SELECT appearance from card_collections_collection cc WHERE cc.collectionId = '${collectionId}' AND deletedAt IS NULL AND appearance > 0)
      AND num  > 0
      ORDER BY num
      )
      SELECT
        uuid() as id,
        numberedCards.id as cardToOripaId,
        numberedCards.cardId as cardId,
        numberedCards.collectionId,
        numberedNumbers.num as seq,
        0 as processed
      FROM numberedCards
      JOIN numberedNumbers ON numberedNumbers.row1 = numberedCards.row1
      UNION
      SELECT
        uuid() as id,
        cc.id as cardToOripaId,
        cc.cardId as cardId,
        cc.collectionId as collectionId,
        appearance as seq,
        0 as processed
      FROM card_collections_collection cc
      WHERE cc.collectionId = '${collectionId}'
      AND deletedAt IS NULL
      AND appearance > 0
      AND status = 'active'
      ORDER BY seq;`,
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
      .update(CardToOripaEntity)
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
        thumbnail: url,
        //collectionId,
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
    return this.cardToOripaRepository
      .createQueryBuilder('card_collections_collection')
      .select('card_collections_collection.collectionId', 'collectionId')
      .addSelect('SUM(card_collections_collection.inventory)', 'inventory')
      .addSelect(
        'SUM(card_collections_collection.initialInventory)',
        'initialInventory',
      )
      .addSelect(
        'SUM(card_collections_collection.inventory) * 1. / SUM(card_collections_collection.initialInventory)',
        'progress',
      )
      .where('card_collections_collection.collectionId IN (:...idList) ', {
        idList,
      })
      .groupBy('card_collections_collection.collectionId')
      .getRawMany();
  }
}
