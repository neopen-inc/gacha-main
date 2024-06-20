import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePointTransactionDto {
  @ApiProperty()
  @IsString()
  type: string;
  @ApiProperty()
  @IsOptional()
  amount: number;
  @ApiProperty()
  @IsString()
  reason: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  pointPackageId?: string;
}
