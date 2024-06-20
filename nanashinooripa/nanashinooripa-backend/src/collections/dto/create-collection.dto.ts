import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({
    type: 'string',
    example: 'コレクション名',
    description: 'コレクション名',
  })
  @IsString()
  name: string;
  @ApiProperty({
    type: 'string',
    example: 'コレクションの説明',
    description: 'コレクションの説明',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: 'string',
    example: 'http://localhost/1.jpg',
  })
  @IsString()
  thumbnail: string;

  @ApiProperty({
    type: 'string',
    example: 'http://localhost/1.jpg',
  })
  @IsString()
  background: string;

  @ApiProperty({
    type: 'string',
    example: 'http://localhost/1.jpg,http://localhost/2.jpg',
  })
  @IsString()
  subImages: string;

  @ApiProperty({
    type: 'number',
    example: 1,
    description: 'コレクションの表示順番',
  })
  @IsOptional()
  seq: number;
  @ApiProperty({
    type: 'string',
    example: 'categoryId',
    description: 'カテゴリーID',
  })
  @IsString()
  categoryId: string;

  @IsOptional()
  gacha1Points: number;

  @IsOptional()
  gacha10Points: number;

  @IsOptional()
  once?: boolean;
  @IsOptional()
  oncePerDay?: boolean;
  @IsOptional()
  refreshAt?: string;
  @IsOptional()
  pickup?: number;

  @ApiProperty({
    type: 'string',
    example: 'active',
    enum: ['active', 'inactive'],
    description: 'コレクションのステータス',
  })
  @IsIn(['active', 'inactive'])
  @IsOptional()
  status?: 'active' | 'inactive';
}
