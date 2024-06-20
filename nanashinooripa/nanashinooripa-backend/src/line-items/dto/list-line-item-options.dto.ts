import { IsOptional, IsString } from 'class-validator';
import { ListQueryOptionsDto } from '../../dto/list-query-options.dto';

export class ListLineItemOptionsDto extends ListQueryOptionsDto {
  @IsString()
  @IsOptional()
  status?: string;
}
