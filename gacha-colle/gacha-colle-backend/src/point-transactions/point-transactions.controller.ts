import { Controller, Get, Post, Body, Param, Request, Delete } from '@nestjs/common';
import { PointTransactionsService } from './point-transactions.service';
import { CreatePointTransactionDto } from './dto/create-point-transaction.dto';
import { RequireAdmin } from '../auth/decorators/admin.decorator';

@Controller('users/:userId/point-transactions')
export class PointTransactionsController {
  constructor(
    private readonly pointTransactionsService: PointTransactionsService,
  ) {}

  @RequireAdmin()
  @Post()
  async create(
    @Param('userId') userId: string,
    @Body() createPointTransactionDto: CreatePointTransactionDto,
  ) {
    return this.pointTransactionsService.create(
      userId,
      createPointTransactionDto,
    );
  }

  @RequireAdmin()
  @Get()
  async findAll(@Request() req, @Param('userId') userId: string) {
    if (req.user.type !== 'admin' && req.user.id !== userId) {
      throw new Error('Forbidden');
    }
    return this.pointTransactionsService.findByUser(userId);
  }

  @RequireAdmin()
  @Get(':id')
  async findOne(
    @Request() req,
    @Param('userId') userId: string,
    @Param('id') id: string,
  ) {
    if (req.user.type !== 'admin' && req.user.id !== userId) {
      throw new Error('Forbidden');
    }
    return this.pointTransactionsService.findOne(userId, id);
  }

  /*
  @RequireAdmin()
  @Patch(':id')
  async update(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() updatePointTransactionDto: UpdatePointTransactionDto,
  ) {
    return this.pointTransactionsService.update(
      userId,
      id,
      updatePointTransactionDto,
    );
  }
  */  
  @RequireAdmin()
  @Delete(':id')
  async remove(@Param('userId') userId: string, @Param('id') id: string) {
    return this.pointTransactionsService.remove(userId, id);
  }
}
