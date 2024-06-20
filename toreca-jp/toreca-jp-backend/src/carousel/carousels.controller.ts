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
import { CarouselsService } from './carousels.service';
import { CreateCarouselDto } from './dto/create-carousel.dto';
import { UpdateCarouselDto } from './dto/update-carousel.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ListQueryOptionsDto } from '../dto/list-query-options.dto';
import { Public } from '../auth/decorators/public.decorator';
import { CarouselListQueryOptionsDto } from './dto/carousel-list-query-options.dto';
import { RequireAdmin } from '../auth/decorators/admin.decorator';

@Controller('categories')
export class CarouselsController {
  constructor(private readonly carouselsService: CarouselsService) { }


  @RequireAdmin()
  @Post()
  @ApiOperation({ summary: 'カテゴリーを作成' })
  async create(@Body() createCarouselDto: CreateCarouselDto) {
    return this.carouselsService.create(createCarouselDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'カテゴリーを一覧' })
  @ApiQuery({ type: ListQueryOptionsDto })
  async findAll(
    @Request() req,
    @Query()
    options: CarouselListQueryOptionsDto,
  ) {
    if (options.status !== 'active' && req.user?.type !== 'admin') {
      throw new ForbiddenException('権限が足りない');
    }
    return this.carouselsService.findAll(options);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'IDでカテゴリーを取得' })
  async findOne(@Param('id') id: string) {
    return this.carouselsService.findOne(id);
  }

  @RequireAdmin()
  @Patch(':id')
  @ApiOperation({ summary: 'カテゴリー情報を更新' })
  async update(
    @Param('id') id: string,
    @Body() updateCarouselDto: UpdateCarouselDto,
  ) {
    return this.carouselsService.update(id, updateCarouselDto);
  }

  @RequireAdmin()
  @Delete(':id')
  @ApiOperation({ summary: 'カテゴリーを削除' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.carouselsService.remove(id);
  }

  @Public()
  @Get(':id/collections')
  @ApiOperation({ summary: 'カテゴリーに属するオリパを取得' })
  async findCollections(@Param('id') id: string) {
    return this.carouselsService.findCollections(id);
  }
}
