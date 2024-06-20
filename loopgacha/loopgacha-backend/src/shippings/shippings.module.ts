import { Module } from '@nestjs/common';
import { ShippingsService } from './shippings.service';
import { ShippingsController } from './shippings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipping } from './entities/shipping.entity';
import { LineItem } from '../line-items/entities/line-item.entity';
import { LineItemsModule } from '../line-items/line-items.module';
import { Address } from '../addresses/entities/address.entity';
import { AddressesModule } from '../addresses/addresses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shipping, LineItem, Address]),
    LineItemsModule,
    AddressesModule,
  ],
  controllers: [ShippingsController],
  providers: [ShippingsService],
  exports: [TypeOrmModule, ShippingsService],
})
export class ShippingsModule {}
