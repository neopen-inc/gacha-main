import { BaseEntity } from '../../entities/base.entities';
import { Column, Entity } from 'typeorm';

@Entity('checkin_config')
export class CheckinConfig extends BaseEntity {
  @Column()
  days: number;
  @Column()
  points: number;
  @Column()
  clearPoints: number;
}
