import { IsIn, IsOptional } from 'class-validator';
import { ListQueryOptionsDto } from '../../dto/list-query-options.dto';

export class ShippingListQueryOptions extends ListQueryOptionsDto {
  @IsOptional()
  @IsIn(['waiting', 'confirmed', 'shipped', 'delivered'])
  status?: 'waiting' | 'confirmed' | 'shipped' | 'delivered';
}
