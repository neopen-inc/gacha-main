import { Module } from '@nestjs/common';
import { GachaService } from './gacha.service';
import { GachaController } from './gacha.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gacha } from './entities/gacha.entity';
import { UsersModule } from '../users/users.module';
import { CardsModule } from '../cards/cards.module';
import { CollectionsModule } from '../collections/collections.module';
import { LineItemsModule } from '../line-items/line-items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gacha]),
    UsersModule,
    CollectionsModule,
    CardsModule,
    LineItemsModule,
  ],
  controllers: [GachaController],
  providers: [GachaService],
  exports: [TypeOrmModule],
})
export class GachaModule { }
