import { IsOptional } from 'class-validator';
import { ListQueryOptionsDto } from '../../dto/list-query-options.dto';

export class UserListQueryDto extends ListQueryOptionsDto {
  @IsOptional()
  email?: string;
}
