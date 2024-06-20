import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListQueryOptionsDto {
  @ApiPropertyOptional({
    type: 'string',
    description: '並び順、カンマ区切りで複数指定可能',
    example: 'createdAt DESC,id ASC',
  })
  @IsOptional()
  @IsString()
  orderby?: string;
  @ApiPropertyOptional({
    type: 'number',
    description: '取得件数',
    example: 10,
  })
  @IsOptional()
  top?: number;
  @ApiPropertyOptional({
    type: 'number',
    description: 'スキップ数',
    example: 0,
  })
  @IsOptional()
  skip?: number;
}
