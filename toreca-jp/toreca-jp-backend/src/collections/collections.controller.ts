import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ListQueryOptionsDto } from '../dto/list-query-options.dto';
import { CollectionListQueryOptions } from './dto/collection-list-queryoptions.dto';
import { Public } from '../auth/decorators/public.decorator';
import { RequireAdmin } from '../auth/decorators/admin.decorator';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) { }

  @RequireAdmin()
  @Post()
  @ApiOperation({ summary: 'オリパを作成' })
  async create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'オリパを一覧' })
  @ApiQuery({ type: ListQueryOptionsDto })
  async findAll(@Request() req, @Query() options: CollectionListQueryOptions) {
    if (options.status !== 'active' && req.user?.type !== 'admin') {
      throw new ForbiddenException('権限が足りない');
    }
    return this.collectionsService.findAll(options);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'IDでオリパを取得' })
  async findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  @RequireAdmin()
  @Patch(':id')
  @ApiOperation({ summary: 'オリパ情報を更新' })
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(id, updateCollectionDto);
  }

  @RequireAdmin()
  @Delete(':id')
  @ApiOperation({ summary: 'オリパを削除' })
  async remove(@Param('id') id: string) {
    return this.collectionsService.remove(id);
  }
}
