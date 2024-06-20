import { BaseEntity } from '../../entities/base.entities';
import { Column, Entity } from 'typeorm';

@Entity()
export class CollectionIp extends BaseEntity {
  @Column({ length: 36 })
  collectionId: string;
  @Column({ length: 100 })
  ip: string;
}
