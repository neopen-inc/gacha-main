import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  defaultAddressId: string;
  @IsString()
  @IsOptional()
  password: string;
}
