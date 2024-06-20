import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePointPackageDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;
  @ApiProperty()
  @IsOptional()
  points: number;
  @ApiProperty()
  @IsOptional()
  price: number;
  @ApiProperty()
  @IsString()
  providerPackageId: string;
}
