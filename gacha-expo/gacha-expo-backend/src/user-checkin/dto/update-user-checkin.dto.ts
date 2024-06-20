import { PartialType } from '@nestjs/mapped-types';
import { CreateUserCheckinDto } from './create-user-checkin.dto';

export class UpdateUserCheckinDto extends PartialType(CreateUserCheckinDto) {}
