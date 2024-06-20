import { PartialType } from '@nestjs/mapped-types';
import { CreatePointPackageDto } from './create-point-package.dto';

export class UpdatePointPackageDto extends PartialType(CreatePointPackageDto) {}
