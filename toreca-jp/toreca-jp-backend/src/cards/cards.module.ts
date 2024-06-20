import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { CardToOripaEntity } from './entities/card-to-oripa.entity';
import { CardSequence } from './entities/card-sequence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card, CardToOripaEntity, CardSequence])],
  controllers: [CardsController],
  providers: [CardsService],
  exports: [TypeOrmModule, CardsService],
})
export class CardsModule {}
