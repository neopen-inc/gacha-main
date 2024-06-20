import { IsIn, IsOptional } from 'class-validator';
import { ListQueryOptionsDto } from '../../dto/list-query-options.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryListQueryOptionsDto extends ListQueryOptionsDto {
  @ApiProperty({
    type: 'string',
    example: 'active',
    enum: ['active', 'inactive'],
    description: 'カテゴリーのステータス',
  })
  @IsIn(['active', 'inactive'])
  @IsOptional()
  status?: string;
}
