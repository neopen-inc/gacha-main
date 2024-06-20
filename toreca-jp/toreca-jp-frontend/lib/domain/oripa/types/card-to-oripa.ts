import { Card } from "./card";
import { Category } from "./category";

export interface CardToOripa {
  id: string;
  cardId: string;
  card: Card;
  collectionId: string;
  seq: number;
  grade: string;
  inventory: number;
  initialInventory: number;
  probability: number;
  appearance: number;
  point: number;
  status: 'active' | 'inactive';
}
