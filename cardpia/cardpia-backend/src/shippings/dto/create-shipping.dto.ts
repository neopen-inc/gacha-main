import { IsArray, IsString } from 'class-validator';

export class CreateShippingDto {
  @IsString()
  userId: string;
  @IsString()
  addressId: string;
  @IsArray()
  lineItems: string[];
}
