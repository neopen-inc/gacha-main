
import { PartialType } from '@nestjs/mapped-types';
import { CreatePointTransactionDto } from './create-point-transaction.dto';

export class UpdatePointTransactionDto extends PartialType(
  CreatePointTransactionDto,
) {}
