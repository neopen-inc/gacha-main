import { IsString } from 'class-validator';

export class CreateBuyDto {
  @IsString()
  userId: string;
  @IsString()
  packageId: string;
}
