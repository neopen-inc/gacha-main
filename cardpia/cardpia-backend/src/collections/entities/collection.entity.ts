import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from '../../categories/entities/category.entity';
import { BaseEntity } from '../../entities/base.entities';
import { Gacha } from '../../gacha/entities/gacha.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

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

  @Column({ type: 'boolean', default: false })
  once: boolean;

  @Column({ type: 'boolean', default: false })
  oncePerDay: boolean;

  @Column({ type: 'tinyint', default: 0 })
  pickup: number;

  @Column({ length: 36, nullable: true })
  refreshAt: string;

  @ManyToOne(() => Category, (category) => category.collections)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

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
