import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';
import { BaseEntity } from '../../entities/base.entities';
import { Gacha } from '../../gacha/entities/gacha.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Card } from '../../cards/entities/card.entity';
import { CardToOripaEntity } from '../../cards/entities/card-to-oripa.entity';

@Entity()
export class Collection extends BaseEntity {
  @ApiProperty({
    type: 'string',
    example: 'ポケモンsv',
  })
  @Column({ length: 255 })
  name: string;
  @ApiProperty({
    type: 'string',
    example: 'ポケモンsv',
  })
  @Column({ length: 1000, default: '' })
  description: string;

  @ApiProperty({
    type: 'string',
    example: 'http://localhost/1.jpg',
  })
  @Column({ length: 1000, default: '', nullable: true })
  thumbnail: string;

  @ApiProperty({
    type: 'string',
    example: 'http://localhost/1.jpg',
  })
  @Column({ length: 1000, default: '', nullable: true })
  background: string;

  @ApiProperty({
    type: 'string',
    example: 'http://localhost/1.jpg,http://localhost/2.jpg',
  })
  @Column({ length: 2000, default: '', nullable: true })
  subImages: string;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @Column({ default: 0 })
  seq: number;

  @ApiPropertyOptional({
    type: 'string',
    example: 'active',
    enum: ['active', 'inactive'],
  })
  @Column({ length: 32, default: 'active' })
  status: 'active' | 'inactive';

  @Column({ length: 36 })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.collections)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToMany(() => Card, (card) => card.collections)
  @JoinTable({ name: 'card_collections_collection' })
  cards: Card;

  @OneToMany(() => CardToOripaEntity, (cardToOripa) => cardToOripa.collection)
  cardToOripas: CardToOripaEntity[];

  @ApiProperty({
    type: 'number',
    example: 100,
  })
  @Column({ default: 0, name: 'gacha1Points' })
  gacha1Points: number;

  @ApiProperty({
    type: 'number',
    example: 1000,
  })
  @Column({ default: 0, name: 'gacha10Points' })
  gacha10Points: number;

  @OneToMany(() => Gacha, (gacha) => gacha.collection)
  gachas: Gacha[];
}
