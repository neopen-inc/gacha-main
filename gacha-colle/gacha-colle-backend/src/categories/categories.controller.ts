import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ListQueryOptionsDto } from '../dto/list-query-options.dto';
import { Public } from '../auth/decorators/public.decorator';
import { CategoryListQueryOptionsDto } from './dto/category-list-query-options.dto';
import { RequireAdmin } from '../auth/decorators/admin.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }


  @RequireAdmin()
  @Post()
  @ApiOperation({ summary: 'カテゴリーを作成' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'カテゴリーを一覧' })
  @ApiQuery({ type: ListQueryOptionsDto })
  async findAll(
    @Request() req,
    @Query()
    options: CategoryListQueryOptionsDto,
  ) {
    if (options.status !== 'active' && req.user?.type !== 'admin') {
      throw new ForbiddenException('権限が足りない');
    }
    return this.categoriesService.findAll(options);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'IDでカテゴリーを取得' })
  async findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @RequireAdmin()
  @Patch(':id')
  @ApiOperation({ summary: 'カテゴリー情報を更新' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @RequireAdmin()
  @Delete(':id')
  @ApiOperation({ summary: 'カテゴリーを削除' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Public()
  @Get(':id/collections')
  @ApiOperation({ summary: 'カテゴリーに属するコレクションを取得' })
  async findCollections(@Param('id') id: string) {
    return this.categoriesService.findCollections(id);
  }
}
