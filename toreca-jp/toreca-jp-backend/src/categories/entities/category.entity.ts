import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Collection } from '../../collections/entities/collection.entity';
import { BaseEntity } from '../../entities/base.entities';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @ApiProperty({
    type: 'string',
    example: 'ポケモンカテゴリー',
  })
  @Column({ length: 255 })
  name: string;

  @ApiPropertyOptional({
    type: 'string',
    example: 'ポケモンカテゴリーの説明',
  })
  @Column({ length: 1000, default: '' })
  description: string;

  @ApiProperty({ type: 'string', example: 'http://example.com/example.jpg' })
  @Column({ length: 1000, default: '', nullable: true })
  thumbnail: string;
  @ApiProperty({ type: 'string', example: 'http://example.com/example.jpg' })
  @Column({ length: 1000, default: '', nullable: true })
  logo: string;
  @ApiPropertyOptional({
    type: 'string',
    example: 'active',
  })
  @Column({ length: 32, default: 'active' })
  status: string;

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
  })
  @Column({ default: 1 })
  seq: number;

  @OneToMany(() => Collection, (collection) => collection.category)
  collections: Collection[];
}
