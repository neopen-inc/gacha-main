import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  @ApiProperty({ type: 'array', example: [], description: '取得データ' })
  data: T[];
  @ApiProperty({ type: 'number', example: 100, description: '全件数' })
  total: number;
  @ApiProperty({ type: 'number', example: 100, description: '取得件数' })
  count: number;
  @ApiProperty({ type: 'number', example: 10, description: '取得数' })
  limit: number;
  @ApiProperty({ type: 'number', example: 0, description: 'スキップ数' })
  offset: number;
}
