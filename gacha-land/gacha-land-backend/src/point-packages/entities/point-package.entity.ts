import { BaseEntity } from '../../entities/base.entities';
import { Column, Entity } from 'typeorm';

@Entity()
export class PointPackage extends BaseEntity {
  @Column({ length: 20 })
  name: string;
  @Column({ length: 255 })
  description: string;
  @Column()
  points: number;
  @Column()
  price: number;
  @Column({ length: 255 })
  providerPackageId: string;
}
