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

  @ApiPropertyOptional({
    type: 'string',
    example: 'https://example.com/image.png',
  })
  @Column({ length: 255, default: '' })
  logo: string;

  @ApiPropertyOptional({
    type: 'string',
    example: 'active',
  })
  @Column({ length: 32, default: 'active' })
  status: string;

  @Column({ default: 0, type: 'int'})
  seq: number;

  @OneToMany(() => Collection, (collection) => collection.category)
  collections: Collection[];
}
