import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GachaService } from './gacha.service';
import { CreateGachaDto } from './dto/create-gacha.dto';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ListGachaQueryOptionsDto } from './dto/list-gacha-query-options.dto';
import { RequireAdmin } from '../auth/decorators/admin.decorator';

@Controller('gacha')
export class GachaController {
  constructor(private readonly gachaService: GachaService) { }

  @Post()
  @ApiOperation({ summary: 'ガチャを引く' })
  @ApiBody({ type: CreateGachaDto })
  async create(@Body() createGachaDto: CreateGachaDto) {
    return this.gachaService.gachaOnce(createGachaDto);
  }

  @RequireAdmin()
  @Get()
  @ApiOperation({
    summary: 'ガチャ履歴を一覧',
    description: 'ガチャ履歴を一覧',
  })
  @ApiQuery({ type: ListGachaQueryOptionsDto })
  async findAll(@Query() options: ListGachaQueryOptionsDto) {
    return this.gachaService.findAll(options);
  }

  /*
  @Get(':id')
  @ApiOperation({ summary: 'IDでガチャを取得' })
  @ApiParam({ name: 'id', type: String, description: 'ガチャID' })
  async findOne(@Param('id') id: string) {
    return this.gachaService.findOne(id);
  }
  

  @RequireAdmin()
  @Patch(':id')
  @ApiOperation({ summary: 'ガチャ情報を更新' })
  @ApiParam({ name: 'id', type: String, description: 'ガチャID' })
  @ApiBody({ type: UpdateGachaDto })
  async update(
    @Param('id') id: string,
    @Body() updateGachaDto: UpdateGachaDto,
  ) {
    return this.gachaService.update(id, updateGachaDto);
  }
  

  @RequireAdmin()
  @Delete(':id')
  @ApiOperation({ summary: 'ガチャを削除' })
  @ApiParam({ name: 'id', type: String, description: 'ガチャID' })
  async remove(@Param('id') id: string) {
    return this.gachaService.remove(id);
  }
  */
}
