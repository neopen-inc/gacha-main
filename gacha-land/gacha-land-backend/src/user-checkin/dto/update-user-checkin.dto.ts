import { PartialType } from '@nestjs/swagger';
import { CreateUserCheckinDto } from './create-user-checkin.dto';

export class UpdateUserCheckinDto extends PartialType(CreateUserCheckinDto) {}
