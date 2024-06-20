import { IsOptional, IsString } from 'class-validator';
import { ListQueryOptionsDto } from '../../dto/list-query-options.dto';

export class UserCheckinListQueryOptionsDto extends ListQueryOptionsDto {
  @IsString()
  @IsOptional()
  userId?: string;
  @IsString()
  @IsOptional()
  checkinDate?: string;
}
