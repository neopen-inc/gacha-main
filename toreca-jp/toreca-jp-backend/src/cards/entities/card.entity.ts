import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../entities/base.entities';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CardToOripaEntity } from './card-to-oripa.entity';
import { Collection } from '../../collections/entities/collection.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Card extends BaseEntity {
  @ApiProperty({ type: 'string', example: 'フシギダネ' })
  @Column({ length: 32 })
  name: string;
  @ApiProperty({ type: 'string', example: 'フシギダネ' })
  @Column({ length: 255 })
  description: string;
  @ApiProperty({ type: 'string', example: 'http://example.com/example.jpg' })
  @Column({ length: 1000, default: '', nullable: true })
  thumbnail: string;
  @ApiProperty({
    type: 'string',
    example: 'http://example.com/example.jpg,http://example.com/example.jpg',
  })
  @Column({ length: 2000, default: '', nullable: true })
  subImages: string;

  @Column({ length: 32 })
  rarity: string;

  @Column({ length: 36 })
  categoryId: string;

  @ManyToOne(() => Category)
  @JoinColumn({
    name: 'categoryId',
    referencedColumnName: 'id',
  })
  category: Category;

  @OneToMany(() => CardToOripaEntity, (cardToOripa) => cardToOripa.card)
  cardToOripas: CardToOripaEntity[];

  @ManyToMany(() => Collection, (collection) => collection.cards)
  @JoinTable({ name: 'card_collections_collection' })
  collections: Collection[];

  @Column({ length: 32, default: 'active' })
  status: 'active' | 'inactive';
}

/**
 @ApiProperty({ type: 'number', example: 10 })
  @Column()
  points: number;
  @ApiProperty({ type: 'string', example: '1等' })
  @Column({ length: 10 })
  grade: string;
 */
