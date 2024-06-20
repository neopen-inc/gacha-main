import { IsIn, IsOptional } from 'class-validator';

export class UpdateShippingDto {
  @IsIn(['waiting', 'confirmed', 'shipped', 'delivered'])
  status: 'waiting' | 'confirmed' | 'shipped' | 'delivered';
  @IsOptional()
  trackingNumber?: string;
  @IsOptional()
  shippingProvider: string;
}
