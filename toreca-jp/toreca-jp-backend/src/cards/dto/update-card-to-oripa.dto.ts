import { PartialType } from '@nestjs/mapped-types';
import { CreateCardToOripaDto } from './create-card-to-oripa.dto';

export class UpdateCardToOripaDto extends PartialType(CreateCardToOripaDto) {}
