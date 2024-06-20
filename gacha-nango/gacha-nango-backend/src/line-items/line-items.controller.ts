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
} from '@nestjs/common';
import { LineItemsService } from './line-items.service';
import { CreateLineItemDto } from './dto/create-line-item.dto';
import { UpdateLineItemDto } from './dto/update-line-item.dto';
import { ListLineItemOptionsDto } from './dto/list-line-item-options.dto';
import { RemoveManyDto } from './dto/remove-many.dto';
import { RequireAdmin } from '../auth/decorators/admin.decorator';

@Controller('line-items')
export class LineItemsController {
  constructor(private readonly lineItemsService: LineItemsService) {}

  /*
  @RequireAdmin()
  @Post()
  create(@Body() createLineItemDto: CreateLineItemDto) {
    return this.lineItemsService.create(createLineItemDto);
  }
  */
  @RequireAdmin()
  @Get()
  findAll(@Query() { top, skip }) {
    return this.lineItemsService.findAll(+top || 10, +skip || 0);
  }
  @RequireAdmin()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lineItemsService.findOne(id);
  }

  /*
  @RequireAdmin()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLineItemDto: UpdateLineItemDto,
  ) {
    return this.lineItemsService.update(id, updateLineItemDto);
  }
  */

  @Patch('users/:userId/return/:id')
  async returnItem(
    @Request() req,
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    if (req.user.type !== 'admin' && req.user.id !== userId) {
      throw new Error('Forbidden');
    }
    return this.lineItemsService.returnItem(userId, id);
  }

  @Patch('users/:userId/return-many')
  async returnMany(
    @Request() req,
    @Param('userId') userId: string,
    @Body() removeManyDto: RemoveManyDto,
  ) {
    if (req.user.type !== 'admin' && req.user.id !== userId) {
      throw new Error('Forbidden');
    }
    return this.lineItemsService.returnItems(userId, removeManyDto.idList);
  }

  @Patch('users/:userId/request-ship/:id')
  async requestShip(
    @Request() req,
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    if (req.user.type !== 'admin' && req.user.id !== userId) {
      throw new Error('Forbidden');
    }
    return this.lineItemsService.requestShip(userId, id);
  }

  /*
  @Delete(':id')
  remove() {
    //return this.lineItemsService.remove(+id);
    throw new Error('Method not allowed.');
  }
  */

  @Get('users/:userId')
  async findByUserId(
    @Param('userId') userId: string,
    @Query() listLineItemOptionsDto: ListLineItemOptionsDto,
  ) {
    return this.lineItemsService.findByUserId(userId, listLineItemOptionsDto);
  }

  @Get('groups/waiting-for-ship')
  async waitingShipGroups() {
    return await this.lineItemsService.waitingShipGroups();
  }
}
