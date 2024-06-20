import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../entities/base.entities';

@Entity('user_checkin')
export class UserCheckin extends BaseEntity {
  @Column({ type: 'varchar', length: 36 })
  userId: string;
  @Column({ type: 'varchar', length: 36 })
  checkinDate: string;
  @Column({ type: 'integer' })
  continues: number;
}
