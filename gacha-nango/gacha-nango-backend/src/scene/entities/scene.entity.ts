import { BaseEntity } from '../../entities/base.entities';
import { Column, Entity } from 'typeorm';

@Entity()
export class Scene extends BaseEntity {
  @Column({ length: 10, type: 'varchar' })
  grade: string;
  @Column({ length: 255, type: 'varchar' })
  url: string;
}
