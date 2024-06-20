export interface Card {
  id: string;
  name: string;
  description: string;
  points: number;
  grade: string;
  thumbnail: string;
  subImages: string;
  collectionId: string;
  probability: number;
  inventory: number;
  initialInventory: number;
  appearance: number;
  status: 'active' | 'inactive';
  pickup: number;
}
