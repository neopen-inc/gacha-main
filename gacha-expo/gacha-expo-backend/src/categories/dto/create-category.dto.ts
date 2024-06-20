import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    type: 'string',
    example: 'ポケモンカテゴリー',
    description: 'カテゴリー名',
  })
  @IsString()
  name: string;
  @ApiPropertyOptional({
    type: 'string',
    example: 'ポケモンカテゴリーの説明',
    description: 'カテゴリーの説明',
  })
  @IsOptional()
  description: string;

  @IsOptional()
  seq: number;
  @ApiProperty({
    type: 'string',
    example: 'active',
    enum: ['active', 'inactive'],
    description: 'カテゴリーのステータス',
  })
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';
}
