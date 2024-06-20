import { IsOptional } from "class-validator";

export class CreateCheckinConfigDto {
  @IsOptional()
  days: number;
  @IsOptional()
  points: number;
  @IsOptional()
  clearPoints: number;
}
