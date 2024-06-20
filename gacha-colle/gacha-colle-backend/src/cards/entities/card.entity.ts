import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../entities/base.entities';
import { Column, Entity } from 'typeorm';

@Entity()
export class Card extends BaseEntity {
  @ApiProperty({ type: 'string', example: 'フシギダネ' })
  @Column({ length: 32 })
  name: string;
  @ApiProperty({ type: 'string', example: 'フシギダネ' })
  @Column({ length: 255 })
  description: string;
  @ApiProperty({ type: 'number', example: 10 })
  @Column()
  points: number;
  @ApiProperty({ type: 'string', example: '1等' })
  @Column({ length: 10 })
  grade: string;
  @ApiProperty({ type: 'string', example: 'http://example.com/example.jpg' })
  @Column({ length: 1000, default: '', nullable: true })
  thumbnail: string;
  @ApiProperty({
    type: 'string',
    example: 'http://example.com/example.jpg,http://example.com/example.jpg',
  })
  @Column({ length: 2000, default: '', nullable: true })
  subImages: string;
  @ApiProperty({ type: 'string', example: 'collectionId' })
  @Column({ length: 36 })
  collectionId: string;
  @ApiProperty({ type: 'number', example: 100 })
  @Column({ default: 0 })
  inventory: number;
  @ApiProperty({ type: 'number', example: 100 })
  @Column({ default: 0 })
  initialInventory: number;

  @Column({ default: 0, type: 'double' })
  probability: number;

  @ApiProperty({ type: 'number', example: 100 })
  @Column({ default: 0, type: 'int' })
  appearance: number;

  @ApiProperty({
    type: 'string',
    example: 'active',
    enum: ['active', 'inactive'],
  })
  @Column({ length: 32, default: 'active' })
  status: 'active' | 'inactive';
}
