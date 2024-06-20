import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Address } from '../../addresses/entities/address.entity';
import { BaseEntity } from '../../entities/base.entities';
import { Gacha } from '../../gacha/entities/gacha.entity';
import { LineItem } from '../../line-items/entities/line-item.entity';
import { PointTransaction } from '../../point-transactions/entities/point-transaction.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @ApiPropertyOptional({
    type: 'string',
    example: 'gacha taro',
  })
  @Column({ length: 255, default: '' })
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'gacha@email.com',
  })
  @Column({ length: 255, unique: true })
  email: string;

  @ApiProperty({
    type: 'string',
    example: 'password',
  })
  @Column({ length: 255 })
  password: string;

  @ApiPropertyOptional({
    type: 'string',
    example: 'admin',
  })
  @Column({ length: 32, default: 'normal' })
  type: 'admin' | 'normal';

  @ApiPropertyOptional({
    type: 'string',
    example: 'admin',
  })
  @Column({ length: 32, default: 'active' })
  status: 'active' | 'inactive';

  @ApiPropertyOptional({
    type: 'string',
    example: 'active',
  })
  @Column({ default: 0 })
  points: number;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @Column({ nullable: true, default: null, type: 'varchar', length: 36 })
  defaultAddressId: string;

  @OneToOne(() => Address, { nullable: true })
  @JoinColumn({
    name: 'defaultAddressId',
    referencedColumnName: 'id',
  })
  defaultAddress: Address;

  @OneToMany(
    () => PointTransaction,
    (pointTransaction) => pointTransaction.user,
  )
  pointTransactions: PointTransaction[];

  @OneToMany(() => Gacha, (gacha) => gacha.user)
  gachas: Gacha[];

  @OneToMany(() => LineItem, (lineItem) => lineItem.user)
  lineItems: LineItem[];
}
