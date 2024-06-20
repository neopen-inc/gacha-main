import { IsArray, IsOptional, IsString } from 'class-validator';
import { ListQueryOptionsDto } from '../../dto/list-query-options.dto';

export class CollectionListQueryOptions extends ListQueryOptionsDto {
  @IsString()
  @IsOptional()
  categoryId?: string;
  @IsString()
  @IsOptional()
  status?: 'active' | 'inactive';
  @IsOptional()
  once?: boolean;
  @IsOptional()
  oncePerDay?: boolean;
  @IsArray()
  @IsOptional()
  excludeIdList?: string[];
  @IsOptional()
  pickup?: number;
}
