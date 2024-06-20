import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../entities/base.entities';
import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Address extends BaseEntity {
  @ApiProperty({ type: 'string', example: '太郎' })
  @Column({ length: 50 })
  firstName: string;
  @ApiProperty({ type: 'string', example: 'ガチャ' })
  @Column({ length: 50 })
  lastName: string;
  @ApiProperty({ type: 'string', example: 'たろう' })
  @Column({ length: 50 })
  firstNameKana: string;
  @ApiProperty({ type: 'string', example: 'ガチャ' })
  @Column({ length: 50 })
  lastNameKana: string;

  @Column({ name: 'userId', length: 50 })
  userId: string;
  @ManyToOne(() => User, (user) => user.addresses, {
    createForeignKeyConstraints: true,
    persistence: false,
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  user: User;
  @ApiProperty({ type: 'string', example: '東京都渋谷区' })
  @Column({ length: 255 })
  addressline1: string;
  @ApiProperty({ type: 'string', example: '神宮前１−１−１' })
  @Column({ length: 255 })
  addressline2: string;
  @ApiProperty({ type: 'string', example: 'ガチャビル６０４' })
  @Column({ length: 255, default: '', nullable: true })
  addressline3?: string;
  @ApiProperty({ type: 'string', example: '1500000' })
  @Column({ length: 20 })
  postcode: string;
  @ApiProperty({ type: 'string', example: '自宅' })
  @Column({ length: 255, default: '', nullable: true })
  description: string;
  @ApiProperty({ type: 'string', example: '09012345678' })
  @Column({ length: 20 })
  phoneNumber: string;
}
