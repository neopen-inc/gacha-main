import { BaseEntity } from '../../entities/base.entities';
import { Column, Entity } from 'typeorm';

@Entity()
export class Token extends BaseEntity {
  @Column({ length: 1024 })
  token: string;
  @Column()
  valid: boolean;
}
