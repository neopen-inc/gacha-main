import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateGachaDto } from './dto/create-gacha.dto';
import { UpdateGachaDto } from './dto/update-gacha.dto';
import { ListGachaQueryOptionsDto } from './dto/list-gacha-query-options.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { Gacha } from './entities/gacha.entity';
import { Collection } from '../collections/entities/collection.entity';
import { User } from '../users/entities/user.entity';
import { Card } from '../cards/entities/card.entity';
import { LineItem } from '../line-items/entities/line-item.entity';
import { findWithPagination } from '../utils/find-with-pagination';
import { CardsService } from '../cards/cards.service';
import { CollectionIp } from '../collections/entities/collection_ip.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Mutex } from 'async-mutex';
import { CardSequence } from '../cards/entities/card-sequence.entity';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { collectionGachaLockKey, collectionSequenceKey, userPointsKey } from '../redis.key';
import { getCollectionUserGacha, setCollectionUserGacha } from '../utils/cache';

@Injectable()
export class GachaService {
  private mutex = new Mutex();

  constructor(
    @InjectRepository(Gacha) private gachaRepository: Repository<Gacha>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    @InjectRepository(CollectionIp)
    private collectionIpRepository: Repository<CollectionIp>,
    @InjectRepository(Card) private cardRepository: Repository<Card>,
    @InjectRepository(LineItem)
    private lineItemRepository: Repository<LineItem>,
    @InjectRepository(CardSequence)
    private cardSequenceRepository: Repository<CardSequence>,
    private cardService: CardsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectEntityManager() private entityManager: EntityManager,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async create(createGachaDto: CreateGachaDto) {
    return 'This action adds a new gacha';
  }

  async checkGachaOnceCollection(createGachaDto: CreateGachaDto, user: User) {
    const historicalGacha = await this.gachaRepository.findOne({
      where: {
        userId: createGachaDto.userId,
        collectionId: createGachaDto.collectionId,
      },
    });
    if (historicalGacha) {
      throw new BadRequestException('Already gacha once');
    }
    const collectionIp = await this.collectionIpRepository.findOne({
      where: { collectionId: createGachaDto.collectionId, ip: user.ip },
    });
    if (!collectionIp) {
      await this.collectionIpRepository.insert({
        collectionId: createGachaDto.collectionId,
        ip: user.ip,
      });
    } else {
      throw new BadRequestException('Already gacha once');
    }
  }

  async retrieveGachaPosition(
    collectionId: string,
    gachaTimes: number,
  ): Promise<{
    startNumber: number;
  }> {
    return this.mutex.runExclusive(async () => {
      /*
      let startNumber = await this.cacheManager.get<number>(
        `gacha-start-${collectionId}`,
      );
      let total = await this.cacheManager.get<number>(
        `gacha-total-${collectionId}`,
      );*/
      const cardCount = await this.cardService.findCollectionProgress([
        collectionId,
      ]);
      if (cardCount.length === 0) {
        throw new BadRequestException('Collection card not found');
      }
      const startNumber =
        cardCount[0].initialInventory - cardCount[0].inventory + 1;
      const total = cardCount[0].initialInventory;
      if (startNumber + gachaTimes - 1 > total) {
        throw new BadRequestException('Not enough cards');
      }
      /*
      if (!startNumber || !total) {
        const cardCount = await this.cardService.findCollectionProgress([
          collectionId,
        ]);
        if (cardCount.length === 0) {
          throw new BadRequestException('Collection card not found');
        }
        startNumber =
          cardCount[0].initialInventory - cardCount[0].inventory + 1;
        total = cardCount[0].initialInventory;
        if (startNumber + gachaTimes - 1 > total) {
          throw new BadRequestException('Not enough cards');
        }
        await this.cacheManager.set(
          `gacha-start-${collectionId}`,
          startNumber + gachaTimes,
        );
        await this.cacheManager.set(`gacha-total-${collectionId}`, total);
        
      }
      */
      return {
        startNumber,
      };
    });
  }
  async retrieveOrSetUserPoints(redis: Redis, userId: string, defaultPoint: number): Promise<number> {
    const userPointsExists = await redis.exists(userPointsKey(userId));
    if (!userPointsExists) {
      await this.redis.set(userPointsKey(userId), defaultPoint);
    }
    const userPoints = parseInt(await this.redis.get(userPointsKey(userId)));
    return userPoints;
  }

  async decreaseUserPoints(redis: Redis, userId: string, points: number) {
    await this.redis.decrby(userPointsKey(userId), points);
  }

  async loadCardSequenceToRedis(redis: Redis, collectionId: string) {
    const sequenceKey = collectionSequenceKey(collectionId);
    const exists = await redis.exists(sequenceKey);
    if (exists) {
      return ;
    }
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
    await redis.del(sequenceKey);
    await redis.rpush(sequenceKey, ...sequenceIdList);
  }
  async gachaCards(redis: Redis, collectionId: string, gachaTimes: number): Promise<string[]> {
    const sequenceKey = collectionSequenceKey(collectionId);
    const seqIdList = await redis.lpop(sequenceKey, gachaTimes);
    return seqIdList;
  }

  async gachaOnce(createGachaDto: CreateGachaDto) {
    const user = await this.userRepository.findOneBy({
      id: createGachaDto.userId,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const collection = await this.collectionRepository.findOneBy({
      id: createGachaDto.collectionId,
      status: 'active',
    });
    if (!collection) {
      throw new BadRequestException('Collection not found');
    }
    if (collection.once && createGachaDto.type === 'ten') {
      throw new BadRequestException('Collection is once only');
    }
    const gachaTimes = createGachaDto.type === 'one' ? 1 : 10;
    const pointsNeeded =
      gachaTimes === 1 ? collection.gacha1Points : collection.gacha10Points;
    
    const userPoints = await this.retrieveOrSetUserPoints(this.redis, user.id, user.points);
    if (userPoints < pointsNeeded) {
      throw new BadRequestException('Not enough points');
    }
    
    if (collection.oncePerDay) {
      const collectionUserGacha = await getCollectionUserGacha(this.redis, collection.id, user.id);
      if (collectionUserGacha) {
        throw new BadRequestException(`Already gacha once: ${collectionUserGacha}`);
      }
    }

    let sequenceIdList: string[] = [];
    try {
      const lockAcquired = await this.redis.set(collectionGachaLockKey(collection.id), 'locked',  'PX', 5000, 'NX');      
      if (!lockAcquired) {
        throw new BadRequestException('Too many requests');
      }
      const collectionSequenceExists = await this.redis.exists(collectionSequenceKey(collection.id));
      if (!collectionSequenceExists) {
        await this.loadCardSequenceToRedis(this.redis, collection.id);
      }

      const remainCardCount = await this.redis.llen(collectionSequenceKey(collection.id));

      if (remainCardCount < gachaTimes) {
        throw new BadRequestException('Not enough cards');
      }
      await setCollectionUserGacha(this.redis, collection.id, user.id);
      await this.decreaseUserPoints(this.redis, user.id, pointsNeeded);
      sequenceIdList = await this.gachaCards(this.redis, collection.id, gachaTimes);
    } finally {
      await this.redis.del(collectionGachaLockKey(collection.id));
    }
  
    const cardSequenceList = await this.cardSequenceRepository.find({
      where: {
        id: In(sequenceIdList),
      }
    });
    
    await this.cardSequenceRepository.update(
      {
        id: In(sequenceIdList),
      },
      {
        processed: 1,
      },
    );
    const gacha = this.gachaRepository.create(createGachaDto);
    await this.gachaRepository.save(gacha);
    await this.userRepository.decrement(
      { id: createGachaDto.userId },
      'points',
      pointsNeeded,
    );
    for (const cardSequence of cardSequenceList) {
      await this.cardRepository.decrement(
        {
          id: cardSequence.cardId,
          collectionId: cardSequence.collectionId,
        },
        'inventory',
        1,
      );
    }

    const lineItems = cardSequenceList.map(
      (cardSequence) =>
        new LineItem({
          userId: createGachaDto.userId,
          cardId: cardSequence.cardId,
          collectionId: createGachaDto.collectionId,
          gachaId: gacha.id,
          shippingId: null,
          status: 'unselected',
        }),
    );
    await this.lineItemRepository.save(lineItems);
    return await this.gachaRepository.findOne({
      where: { id: gacha.id },
      relations: [
        'user',
        'lineItems',
        'lineItems.card',
        'lineItems.collection',
      ],
      select: {
        lineItems: {
          id: true,
          status: true,
          card: {
            id: true,
            name: true,
            thumbnail: true,
            points: true,
            collectionId: true,
            grade: true,
          },
          collection: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll({ top, skip, orderby, userId }: ListGachaQueryOptionsDto) {
    return findWithPagination(this.gachaRepository, {
      top,
      skip,
      orderby,
      relations: ['user', 'lineItems', 'lineItems.card'],
      ...(userId ? { userId } : {}),
    });
  }

  async findOne(id: string) {
    return `This action returns a #${id} gacha`;
  }

  async update(id: string, updateGachaDto: UpdateGachaDto) {
    return `This action updates a #${id} gacha`;
  }

  async remove(id: string) {
    return `This action removes a #${id} gacha`;
  }
}
