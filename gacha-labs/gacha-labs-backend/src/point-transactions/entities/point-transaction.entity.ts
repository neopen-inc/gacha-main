import { BaseEntity } from '../../entities/base.entities';
import { PointPackage } from '../../point-packages/entities/point-package.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class PointTransaction extends BaseEntity {
  @Column({ length: 36, nullable: false })
  userId: string;
  @Column({ length: 36, nullable: false })
  type: string;
  @Column({ length: 500, nullable: true })
  reason: string;
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  @ManyToOne(() => User, (user) => user.pointTransactions)
  user: User;

  @Column({ type: 'integer' })
  amount: number;

  @ManyToOne(() => PointPackage)
  @JoinColumn({
    name: 'pointPackageId',
    referencedColumnName: 'id',
  })
  pointPackage: PointPackage;

  @Column({
    length: 36,
    name: 'pointPackageId',
    nullable: true,
    default: null,
  })
  pointPackageId: string;
}
