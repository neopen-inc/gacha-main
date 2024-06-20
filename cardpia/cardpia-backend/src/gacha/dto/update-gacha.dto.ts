import { PartialType } from '@nestjs/mapped-types';
import { CreateGachaDto } from './create-gacha.dto';

export class UpdateGachaDto extends PartialType(CreateGachaDto) {}
