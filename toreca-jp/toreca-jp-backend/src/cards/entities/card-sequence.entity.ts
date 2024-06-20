import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../entities/base.entities';

@Entity('card_sequence')
export class CardSequence extends BaseEntity {
  @Column({ length: 36, type: 'varchar' })
  cardId: string;

  @Column({ length: 36, type: 'varchar' })
  cardToOripaId: string;

  @Column({ length: 36, type: 'varchar' })
  collectionId: string;

  @Column({ type: 'integer' })
  seq: number;

  @Column({ type: 'integer' })
  processed: number;
}
