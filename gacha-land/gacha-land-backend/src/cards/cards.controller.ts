import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
  Request,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { ListQueryOptionsDto } from '../dto/list-query-options.dto';
import { PaginatedResponse } from '../dto/paginated-response.dto';
import { Card } from './entities/card.entity';
import { CardListQueryOptionsDto } from './dto/card-list-query-options.dto';
import { Public } from '../auth/decorators/public.decorator';
import { RequireAdmin } from '../auth/decorators/admin.decorator';
import { pick } from 'lodash';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @RequireAdmin()
  @Post()
  @ApiOperation({ summary: 'カードを作成' })
  @ApiBody({ type: CreateCardDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Card })
  async create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @Public()
  @Get()
  @ApiQuery({ type: ListQueryOptionsDto })
  @ApiOperation({ summary: 'カードを一覧' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PaginatedResponse<Card> })
  async findAll(@Request() req, @Query() options: CardListQueryOptionsDto) {
    const cards = await this.cardsService.findAll(options);
    if (req.user?.type !== 'admin') {
      return {
        ...cards,
        data: cards.data.map((card) =>
          pick(card, ['id', 'name', 'grade', 'collectionId', 'points' , 'thumbnail']),
        ),
      };
    }
    return cards;
  }

  @RequireAdmin()
  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'IDでカードを取得' })
  async findOne(@Param('id') id: string) {
    return this.cardsService.findOne(id);
  }

  @RequireAdmin()
  @Patch(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'カード情報を更新' })
  @ApiBody({ type: UpdateCardDto })
  async update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(id, updateCardDto);
  }

  @RequireAdmin()
  @Delete(':id')
  @ApiParam({ name: 'id', type: String })
  @ApiOperation({ summary: 'カードを削除' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.cardsService.remove(id);
  }

  @RequireAdmin()
  @Post('collections/:collectionId/fetch-and-upload')
  async fetchAndUpload(
    @Param('collectionId') collectionId: string,
    @Body() { cardList }: { cardList: { href: string; text: string }[] },
  ) {
    return this.cardsService.fetchAndUpload(collectionId, cardList);
  }

  @RequireAdmin()
  @Post('collections/:collectionId/reset')
  async resetCollectionStatus(@Param('collectionId') collectionId: string) {
    return this.cardsService.resetCollectionStatus(collectionId);
  }

  @RequireAdmin()
  @Post('collections/:collectionId/randomlize')
  async randomlizeCard(@Param('collectionId') collectionId: string) {
    return await this.cardsService.randomlizeCard(collectionId);
  }

  @RequireAdmin()
  @Get('collections/:collectionId/generate-status')
  async generateStatus(@Param('collectionId') collectionId: string) {
    return await this.cardsService.generateStatus(collectionId);
  }

  @RequireAdmin()
  @Get('collections/generate-status/multiple')
  async generateStatusMultiple(
    @Query('idList', new ParseArrayPipe({ items: String, separator: ',' }))
    idList: string[],
  ) {
    return await this.cardsService.generateStatusMultiple(idList);
  }

  @Public()
  @Get('collections/progress')
  async findCollectionProgress(
    @Query('idList', new ParseArrayPipe({ items: String, separator: ',' }))
    idList: string[],
  ): Promise<
    {
      collectionId: string;
      inventory: number;
      initialInventory: number;
      progress: number;
    }[]
  > {
    if (idList.length === 0) {
      return [];
    }
    const cacheResult: {
      collectionId: string;
      inventory: number;
      initialInventory: number;
      progress: number;
    }[] = [];
    const queryList: string[] = [];
    for (const id of idList) {
      const cacheKey = `collection-progress-${id}`;

      const value = await this.cacheManager.get(cacheKey);
      if (
        value &&
        typeof value === 'object' &&
        'progress' in value &&
        'inventory' in value &&
        'initialInventory' in value &&
        'collectionId' in value
      ) {
        cacheResult.push(
          value as {
            collectionId: string;
            inventory: number;
            initialInventory: number;
            progress: number;
          },
        );
      } else {
        queryList.push(id);
      }
    }
    let remains: {
      collectionId: string;
      inventory: number;
      initialInventory: number;
      progress: number;
    }[] = [];
    if (queryList.length > 0) {
      remains = await this.cardsService.findCollectionProgress(queryList);
      for (const remain of remains) {
        const cacheKey = `collection-progress-${remain.collectionId}`;
        await this.cacheManager.set(cacheKey, remain, 5 * 1000);
      }
    }
    return [...cacheResult, ...remains];
  }
}
