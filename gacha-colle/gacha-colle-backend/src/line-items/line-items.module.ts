import { Module, forwardRef } from '@nestjs/common';
import { LineItemsService } from './line-items.service';
import { LineItemsController } from './line-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LineItem } from './entities/line-item.entity';
import { PointTransactionsModule } from '../point-transactions/point-transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LineItem]),
    forwardRef(() => PointTransactionsModule),
  ],
  controllers: [LineItemsController],
  providers: [LineItemsService],
  exports: [TypeOrmModule, LineItemsService],
})
export class LineItemsModule {}
