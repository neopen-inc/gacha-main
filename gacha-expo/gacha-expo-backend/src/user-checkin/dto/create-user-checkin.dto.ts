import { IsString } from "class-validator";

export class CreateUserCheckinDto {
  @IsString()
  userId: string;
}
