import { IsString } from 'class-validator';
import { ListQueryOptionsDto } from '../../dto/list-query-options.dto';

export class ListGachaQueryOptionsDto extends ListQueryOptionsDto {
  @IsString()
  userId: string;
}
