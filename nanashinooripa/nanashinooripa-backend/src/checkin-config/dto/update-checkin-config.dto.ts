import { PartialType } from '@nestjs/swagger';
import { CreateCheckinConfigDto } from './create-checkin-config.dto';

export class UpdateCheckinConfigDto extends PartialType(CreateCheckinConfigDto) {}
