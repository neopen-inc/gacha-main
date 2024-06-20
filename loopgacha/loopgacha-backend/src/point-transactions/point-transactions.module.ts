import { Module, forwardRef } from '@nestjs/common';
import { PointTransactionsService } from './point-transactions.service';
import { PointTransactionsController } from './point-transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointTransaction } from './entities/point-transaction.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PointTransaction]),
    forwardRef(() => UsersModule),
  ],
  controllers: [PointTransactionsController],
  providers: [PointTransactionsService],
  exports: [TypeOrmModule, PointTransactionsService],
})
export class PointTransactionsModule {}
