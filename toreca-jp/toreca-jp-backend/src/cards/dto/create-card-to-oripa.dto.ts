import { IsOptional } from 'class-validator';

export class CreateCardToOripaDto {
  @IsOptional()
  seq: number;

  @IsOptional()
  grade: string;

  @IsOptional()
  inventory: number;
  @IsOptional()
  initialInventory: number;

  @IsOptional()
  probability: number;

  @IsOptional()
  point: number;

  @IsOptional()
  appearance: number;

  @IsOptional()
  status: 'active' | 'inactive';
}
