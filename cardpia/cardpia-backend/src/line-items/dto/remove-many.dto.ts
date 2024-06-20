import { IsArray, IsOptional } from 'class-validator';
import { ListQueryOptionsDto } from '../../dto/list-query-options.dto';

export class RemoveManyDto extends ListQueryOptionsDto {
  @IsOptional()
  idList: string[];
}
