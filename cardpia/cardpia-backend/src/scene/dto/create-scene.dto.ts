import { IsString } from 'class-validator';

export class CreateSceneDto {
  @IsString()
  grade: string;
  @IsString()
  url: string;
}
