import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../entities/base.entities';
import { User } from '../../users/entities/user.entity';
import { PointPackage } from '../../point-packages/entities/point-package.entity';

@Entity('payment')
export class Payment extends BaseEntity {
  @Column({ length: 100 })
  sessionId: string;
  @ManyToOne(() => User)
  user: User;
  @Column({ length: 36 })
  userId: string;
  @ManyToOne(() => PointPackage)
  pointPackage: PointPackage;
  @Column({ length: 36 })
  pointPackageId: string;
  @Column({ length: 36 })
  status: 'pending' | 'cancel' | 'success';
}
