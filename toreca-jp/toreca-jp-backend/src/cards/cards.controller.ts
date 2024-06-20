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
import { omit, pick } from 'lodash';
import { CardToOripaEntity } from './entities/card-to-oripa.entity';
import { CreateCardToOripaDto } from './dto/create-card-to-oripa.dto';
import { UpdateCardToOripaDto } from './dto/update-card-to-oripa.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @RequireAdmin()
  @Post()
  @ApiOperation({ summary: 'カードを作成' })
  @ApiBody({ type: CreateCardDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Card })
  async create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @RequireAdmin()
  @Post(':cardId/collection/:collectionId/associate')
  async associateCardToOripa(
    @Param('cardId') cardId,
    @Param('collectionId') collectionId,
    @Body() createCardToOripaDto: CreateCardToOripaDto,
  ): Promise<CardToOripaEntity> {
    return this.cardsService.createCardToOripaEntity(
      cardId,
      collectionId,
      createCardToOripaDto,
    );
  }

  @Public()
  @Get('collection/:collectionId')
  async getCollectionCards(
    @Request() req,
    @Param('collectionId') collectionId,
    @Query() options: CardListQueryOptionsDto,
  ) {
    const response = await this.cardsService.findAllCardToOripaEntity(collectionId, options);
    if (req.user?.type !== 'admin') {
      return {
        ...response,
        data: response.data.map((d) => omit(d, ['initialInventory', 'inventory', 'point', 'probability', 'appearance'])),
      };
    }
    return response;
  }

  @RequireAdmin()
  @Patch('card-to-oripa/:id')
  async updateCardToOripa(
    @Param('id') id,
    @Body() updateCardToOripaDto: UpdateCardToOripaDto,
  ): Promise<void> {
    await this.cardsService.updateCardToOripaEntity(id, updateCardToOripaDto);
  }

  @RequireAdmin()
  @Delete('card-to-oripa/:id')
  async deleteCardToOripa(@Param('id') id): Promise<void> {
    await this.cardsService.deleteCardToOripaEntity(id);
  }

  @Public()
  @Get()
  @ApiQuery({ type: ListQueryOptionsDto })
  @ApiOperation({ summary: 'カードを一覧' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PaginatedResponse<Card> })
  async findAll(@Request() req, @Query() options: CardListQueryOptionsDto) {
    if (req.user?.type !== 'admin' && options.status !== 'active') {
      throw new ForbiddenException('権限が足りない');
    }
    const cards = await this.cardsService.findAll(options);
    if (req.user?.type !== 'admin') {
      return {
        ...cards,
        data: cards.data.map((card) =>
          pick(card, ['id', 'name', 'grade', 'collectionId', 'points']),
        ),
      };
    }
    return cards;
  }

  @Public()
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
  ) {
    
    return this.cardsService.findCollectionProgress(idList);
  }
}
