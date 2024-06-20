import { ApiProperty } from '@nestjs/swagger';
import { Collection } from '../../collections/entities/collection.entity';
import { BaseEntity } from '../../entities/base.entities';
import { LineItem } from '../../line-items/entities/line-item.entity';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Gacha extends BaseEntity {
  @ApiProperty({ type: 'string', example: 'abcd-abcd' })
  @Column({ length: 36 })
  userId: string;

  @ApiProperty({
    type: 'string',
    example: 'one',
    enum: ['one', 'ten'],
    description: 'ガチャの種類, 一回、十連',
  })
  @Column({ length: 10 })
  type: string;

  @ManyToOne(() => User, (user) => user.gachas, {
    createForeignKeyConstraints: true,
    persistence: false,
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user: User;

  @ApiProperty({ type: 'string', example: 'abcd-abcd' })
  @Column({ length: 36 })
  collectionId: string;

  @ManyToOne(() => Collection, (collection) => collection.gachas, {
    createForeignKeyConstraints: true,
    persistence: false,
  })
  @JoinColumn({
    name: 'collectionId',
    referencedColumnName: 'id',
  })
  collection: Collection;

  @OneToMany(() => LineItem, (lineItem) => lineItem.gacha)
  lineItems: LineItem[];
}
