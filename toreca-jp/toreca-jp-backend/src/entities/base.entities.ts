import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
} from 'typeorm';

export abstract class Model {
  constructor(input?: any) {
    if (input) {
      for (const [key, value] of Object.entries(input)) {
        (this as any)[key] = value;
      }
    }
  }
}

export interface BaseSoftDeletableEntityModel {
  deletedAt?: Date;
}

export interface BaseTrackableEntityModel extends BaseSoftDeletableEntityModel {
  id: string;

  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export abstract class BaseEntity
  extends Model
  implements BaseTrackableEntityModel {
  @ApiPropertyOptional({ type: () => String })
  @PrimaryColumn({ generated: 'uuid' })
  id: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    example: '2018-11-21T06:20:32.232Z',
  })
  @CreateDateColumn()
  createdAt?: Date;

  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    example: '2018-11-21T06:20:32.232Z',
  })
  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
