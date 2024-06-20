import { Address } from '../../addresses/entities/address.entity';
import { BaseEntity } from '../../entities/base.entities';
import { LineItem } from '../../line-items/entities/line-item.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Shipping extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
  @Column({ length: 36 })
  userId: string;
  @ManyToOne(() => Address)
  @JoinColumn({ name: 'addressId' })
  address: Address;
  @Column({ length: 36 })
  addressId: string;
  @OneToMany(() => LineItem, (lineItem) => lineItem.shipping)
  lineItems: LineItem[];
  @Column({ name: 'orderedAt', type: 'timestamp', nullable: true })
  orderedAt?: Date;
  @Column({ name: 'confirmedAt', type: 'timestamp', nullable: true })
  confirmedAt?: Date;
  @Column({ name: 'shippedAt', type: 'timestamp', nullable: true })
  shippedAt?: Date;
  @Column({ length: 36, nullable: true, type: 'varchar' })
  trackingNumber?: string;
  @Column({ length: 36, nullable: true, type: 'varchar' })
  shippingProvider?: string;
  @Column({
    name: 'addressInfo',
    nullable: true,
    type: 'varchar',
    length: 2000,
  })
  addressInfo: string;
  @Column({ length: 32, default: 'waiting' })
  status: 'waiting' | 'confirmed' | 'shipped' | 'delivered';
}
