import { Module, forwardRef } from '@nestjs/common';
import { UserCheckinService } from './user-checkin.service';
import { UserCheckinController } from './user-checkin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCheckin } from './entities/user-checkin.entity';
import { PointTransactionsModule } from '../point-transactions/point-transactions.module';
import { CheckinConfigModule } from '../checkin-config/checkin-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCheckin]),
    forwardRef(() => PointTransactionsModule),
    forwardRef(() => CheckinConfigModule),
  ],
  controllers: [UserCheckinController],
  providers: [UserCheckinService],
  exports: [TypeOrmModule],
})
export class UserCheckinModule {}
