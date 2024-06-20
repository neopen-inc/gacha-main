import { Injectable } from '@nestjs/common';
import { CreateLineItemDto } from './dto/create-line-item.dto';
import { UpdateLineItemDto } from './dto/update-line-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LineItem } from './entities/line-item.entity';
import { In, Repository } from 'typeorm';
import { findWithPagination } from '../utils/find-with-pagination';
import { ListLineItemOptionsDto } from './dto/list-line-item-options.dto';
import { PointTransactionsService } from '../point-transactions/point-transactions.service';

@Injectable()
export class LineItemsService {
  constructor(
    @InjectRepository(LineItem)
    private lineItemRepository: Repository<LineItem>,
    private pointTransactionService: PointTransactionsService,
  ) {}
  create(createLineItemDto: CreateLineItemDto) {
    return this.lineItemRepository.create(new LineItem(createLineItemDto));
  }

  async findAll(top: number, skip: number, orderby = 'createdAt DESC') {
    return findWithPagination(this.lineItemRepository, { top, skip, orderby });
  }

  async findByUserId(
    userId: string,
    listQueryOptionsDto: ListLineItemOptionsDto,
  ) {
    const { status, ...rest } = listQueryOptionsDto;
    return findWithPagination(this.lineItemRepository, {
      ...rest,
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      relations: ['card', 'collection', 'gacha'],
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        card: {
          id: true,
          name: true,
          points: true,
          thumbnail: true,
          grade: true,
        },
        collection: {
          id: true,
          name: true,
        },
        gacha: {
          id: true,
        },
      },
    });
  }

  async findOne(id: string) {
    return this.lineItemRepository.findOne({
      where: {
        id,
      },
      relations: ['card', 'collection', 'gacha'],
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        card: {
          id: true,
          name: true,
          points: true,
          thumbnail: true,
          grade: true,
        },
        collection: {
          id: true,
          name: true,
        },
        gacha: {
          id: true,
        },
      },
    });
  }

  async update(id: string, updateLineItemDto: UpdateLineItemDto) {
    return this.lineItemRepository.update(id, updateLineItemDto);
  }

  async remove(id: number) {
    return this.lineItemRepository.softDelete(id);
  }

  async removeMany(idList: number[]) {
    return this.lineItemRepository.softDelete(idList);
  }

  async returnItem(userId: string, lineItemId: string) {
    const lineItem = await this.lineItemRepository.findOne({
      where: { id: lineItemId, userId },
      relations: ['card', 'collection', 'gacha'],
    });
    if (!lineItem) {
      throw new Error('Line item not found');
    }
    if (lineItem.status !== 'unselected') {
      throw new Error('403');
    }
    await this.lineItemRepository.update(lineItemId, { status: 'returned' });
    await this.pointTransactionService.create(lineItem.userId, {
      amount: lineItem.card.points,
      type: 'return',
      reason: 'ポイント交換: ' + lineItem.id,
    });
    return {
      item: lineItem.id,
      points: lineItem.card.points,
    };
  }
  async returnItems(userId: string, lineItemIdList: string[]) {
    const lineItems = await this.lineItemRepository.find({
      where: {
        id: In(lineItemIdList),
        userId,
        status: 'unselected',
      },
      relations: ['card', 'collection', 'gacha'],
    });
    if (lineItems.length != lineItemIdList.length) {
      throw new Error('403');
    }
    const points = lineItems.reduce((acc, lineItem) => {
      acc += lineItem.card.points;
      return acc;
    }, 0);
    await this.lineItemRepository.update(
      {
        id: In(lineItemIdList),
      },
      { status: 'returned' },
    );
    await this.pointTransactionService.create(userId, {
      amount: points,
      type: 'return',
      reason:
        'ポイント交換: ' + lineItems.map((lineItem) => lineItem.id).join(','),
    });
    return {
      items: lineItems.map((lineItem) => lineItem.id),
      points,
    };
  }

  async waitingShipGroups() {
    const lineItems = await this.lineItemRepository.find({
      where: {
        status: 'waiting_for_ship',
      },
      relations: ['card', 'collection', 'gacha'],
    });

    const groups = lineItems.reduce((acc, lineItem) => {
      if (!acc[lineItem.userId]) {
        acc[lineItem.userId] = [];
      }
      acc[lineItem.userId].push(lineItem);
      return acc;
    }, {});
    return Object.keys(groups).map((userId) => ({
      userId,
      items: groups[userId],
    }));
  }

  async requestShip(userId: string, id: string) {
    const lineItem = await this.lineItemRepository.findOne({
      where: { userId, id },
      relations: ['card', 'collection', 'gacha'],
    });
    if (!lineItem) {
      throw new Error('Line item not found');
    }
    if (lineItem.status !== 'unselected') {
      throw new Error('403');
    }
    await this.lineItemRepository.update(id, { status: 'waiting_for_ship' });
    return {
      item: lineItem.id,
      points: lineItem.card.points,
    };
  }
}
