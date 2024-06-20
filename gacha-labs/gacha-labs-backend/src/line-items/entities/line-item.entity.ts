import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../../addresses/entities/address.entity';
import { Card } from '../../cards/entities/card.entity';
import { Collection } from '../../collections/entities/collection.entity';
import { BaseEntity } from '../../entities/base.entities';
import { Gacha } from '../../gacha/entities/gacha.entity';
import { Shipping } from '../../shippings/entities/shipping.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class LineItem extends BaseEntity {
  @ApiProperty({
    type: 'string',
    example: 'abcde-abcde-abcde-abcde-abcde',
  })
  @Column({ length: 36 })
  cardId: string;
  @ManyToOne(() => Card)
  @JoinColumn({ name: 'cardId' })
  card: Card;
  @ApiProperty({
    type: 'string',
    example: 'abcde-abcde-abcde-abcde-abcde',
  })
  @Column({ length: 36 })
  collectionId: string;
  @ManyToOne(() => Collection)
  @JoinColumn({ name: 'collectionId' })
  collection: Collection;
  @ApiProperty({
    type: 'string',
    example: 'abcde-abcde-abcde-abcde-abcde',
  })
  @Column({ length: 36 })
  userId: string;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
  @ApiProperty({
    type: 'string',
    example: 'abcde-abcde-abcde-abcde-abcde',
  })
  @Column({ length: 36 })
  gachaId: string;
  @ManyToOne(() => Gacha)
  @JoinColumn({ name: 'gachaId' })
  gacha: Gacha;
  @ApiProperty({
    type: 'string',
    example: 'abcde-abcde-abcde-abcde-abcde',
  })
  @Column({ length: 36, nullable: true })
  shippingId: string;
  @ManyToOne(() => Shipping, (shipping) => shipping.lineItems)
  @JoinColumn({ name: 'shippingId' })
  shipping: Shipping;

  @Column({ length: 36, nullable: true })
  addressId: string;
  @ManyToOne(() => Address)
  @JoinColumn({ name: 'addressId' })
  address: Address;
  @ApiProperty({
    type: 'string',
    example: 'unselected',
  })
  @Column({ length: 32, default: 'waiting' })
  status: 'unselected' | 'returned' | 'waiting_for_ship' | 'shipped';
}
