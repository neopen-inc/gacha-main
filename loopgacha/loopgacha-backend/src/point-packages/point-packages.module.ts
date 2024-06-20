import { Module, forwardRef } from '@nestjs/common';
import { PointPackagesService } from './point-packages.service';
import { PointPackagesController } from './point-packages.controller';
import { PointPackage } from './entities/point-package.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentModule } from '../payment/payment.module';
import { PointTransactionsModule } from '../point-transactions/point-transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PointPackage, Payment]),
    PaymentModule,
    forwardRef(() => PointTransactionsModule),
  ],
  controllers: [PointPackagesController],
  providers: [PointPackagesService],
  exports: [TypeOrmModule],
})
export class PointPackagesModule {}
