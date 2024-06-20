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
import { ShippingsService } from './shippings.service';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { ShippingListQueryOptions } from './dto/shipping-list-query-options.dto';
import { RequireAdmin } from '../auth/decorators/admin.decorator';

@Controller('shippings')
export class ShippingsController {
  constructor(private readonly shippingsService: ShippingsService) {}

  @Post()
  async create(@Request() req, @Body() createShippingDto: CreateShippingDto) {
    if (
      req.user?.status !== 'active' ||
      req.user?.id !== createShippingDto.userId
    ) {
      throw new ForbiddenException('権限が足りない');
    }
    return this.shippingsService.create(createShippingDto);
  }

  @RequireAdmin()
  @Get()
  async findAll(@Query() shippingOptions: ShippingListQueryOptions) {
    return this.shippingsService.findAll(shippingOptions);
  }

  @RequireAdmin()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.shippingsService.findOne(id);
  }

  @RequireAdmin()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShippingDto: UpdateShippingDto,
  ) {
    return this.shippingsService.update(id, updateShippingDto);
  }

  @RequireAdmin()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.shippingsService.remove(id);
  }
}
