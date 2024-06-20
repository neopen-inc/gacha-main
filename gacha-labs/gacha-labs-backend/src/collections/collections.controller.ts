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
import { UsersService } from '../users/users.service';

@Controller('collections')
export class CollectionsController {
  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly userService: UsersService,
  ) {}

  @RequireAdmin()
  @Post()
  @ApiOperation({ summary: 'コレクションを作成' })
  async create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionsService.create(createCollectionDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'コレクションを一覧' })
  @ApiQuery({ type: ListQueryOptionsDto })
  async findAll(@Request() req, @Query() options: CollectionListQueryOptions) {
    if (options.status !== 'active' && req.user?.type !== 'admin') {
      throw new ForbiddenException('権限が足りない');
    }
    let excludeIdList: string[] = [];
    if (!req.user) {
      excludeIdList = await this.collectionsService
        .findAll({
          once: true,
          top: 1000000,
        })
        .then((value) => value.data.map((collection) => collection.id));
    } else if (req.user.type === 'normal') {
      const user = await this.userService.findOne(req.user.id);
      if (user) {
        excludeIdList = await this.collectionsService.findAllCollectionByIp(
          user.ip,
        );
      }
    }
    return this.collectionsService.findAll({
      ...options,
      excludeIdList,
    });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'IDでコレクションを取得' })
  async findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  @RequireAdmin()
  @Patch(':id')
  @ApiOperation({ summary: 'コレクション情報を更新' })
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(id, updateCollectionDto);
  }

  @RequireAdmin()
  @Delete(':id')
  @ApiOperation({ summary: 'コレクションを削除' })
  async remove(@Param('id') id: string) {
    return this.collectionsService.remove(id);
  }
}
