import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../entities/base.entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Card } from './card.entity';
import { Collection } from '../../collections/entities/collection.entity';

@Entity('card_collections_collection')
export class CardToOripaEntity extends BaseEntity {
  @Column({ length: 36 })
  cardId: string;

  @Column({ length: 32 })
  grade: string;

  @ApiProperty({ type: 'string', example: 'collectionId' })
  @Column({ length: 36 })
  collectionId: string;
  @ApiProperty({ type: 'number', example: 100 })
  @Column({ default: 0 })
  inventory: number;
  @ApiProperty({ type: 'number', example: 100 })
  @Column({ default: 0 })
  initialInventory: number;

  @ApiProperty({ type: 'number', example: 100 })
  @Column({ default: 0 })
  point: number;
  @Column({ default: 0, type: 'double' })
  probability: number;

  @ApiProperty({ type: 'number', example: 100 })
  @Column({ default: 0, type: 'int' })
  appearance: number;

  @Column({ default: 0, type: 'int' })
  seq: number;

  @ApiProperty({
    type: 'string',
    example: 'active',
    enum: ['active', 'inactive'],
  })
  @Column({ length: 32, default: 'active' })
  status: 'active' | 'inactive';

  @ManyToOne(() => Card, (card) => card.cardToOripas)
  card: CardToOripaEntity;
  @ManyToOne(() => Collection, (collection) => collection.cardToOripas)
  collection: CardToOripaEntity;
}
