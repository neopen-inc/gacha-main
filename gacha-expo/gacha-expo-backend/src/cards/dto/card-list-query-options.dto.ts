import { IsOptional, IsString } from 'class-validator';
import { ListQueryOptionsDto } from '../../dto/list-query-options.dto';

export class CardListQueryOptionsDto extends ListQueryOptionsDto {
  @IsString()
  @IsOptional()
  collectionId?: string;
  @IsString()
  @IsOptional()
  status?: 'inactive' | 'active';

  @IsString()
  @IsOptional()
  grade?: string;
  @IsString()
  @IsOptional()
  name?: string;
}
