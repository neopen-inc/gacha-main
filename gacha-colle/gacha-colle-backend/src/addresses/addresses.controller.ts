import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('users/:userId/addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({
    summary: '住所を作成',
    description:
      '住所は発送用です、一人のユーザーが複数住所登録可能（５個まで）。',
  })
  @ApiBody({ type: CreateAddressDto })
  @ApiParam({ name: 'userId', type: String, description: 'ユーザーID' })
  create(
    @Request() req,
    @Param('userId') userId: string,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    if (req.user?.status !== 'active' || req.user?.id !== userId) {
      throw new ForbiddenException('権限が足りない');
    }
    return this.addressesService.create(userId, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: '住所を一覧' })
  @ApiParam({ name: 'userId', type: String, description: 'ユーザーID' })
  findAll(@Request() req, @Param('userId') userId: string) {
    if (req.user?.id !== userId && req.user?.type !== 'admin') {
      throw new ForbiddenException('権限が足りない');
    }
    return this.addressesService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'IDで住所を取得' })
  @ApiParam({ name: 'userId', type: String, description: 'ユーザーID' })
  @ApiParam({ name: 'id', type: String, description: '住所ID' })
  findOne(
    @Request() req,
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    if (req.user?.id !== userId && req.user?.type !== 'admin') {
      throw new ForbiddenException('権限が足りない');
    }
    return this.addressesService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '住所情報を更新' })
  @ApiParam({ name: 'userId', type: String, description: 'ユーザーID' })
  @ApiParam({ name: 'id', type: String, description: '住所ID' })
  @ApiBody({ type: UpdateAddressDto })
  update(
    @Request() req,
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    if (req.user?.id !== userId && req.user?.type !== 'admin') {
      throw new ForbiddenException('権限が足りない');
    }
    return this.addressesService.update(userId, id, updateAddressDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'userId', type: String, description: 'ユーザーID' })
  @ApiParam({ name: 'id', type: String, description: '住所ID' })
  remove(
    @Request() req,
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    if (req.user?.id !== userId && req.user?.type !== 'admin') {
      throw new ForbiddenException('権限が足りない');
    }
    return this.addressesService.remove(userId, id);
  }
}
