import { Category } from "./category";

export interface Card {
  id: string;
  name: string;
  description: string;
  //points: number;
  //grade: string;
  thumbnail: string;
  subImages: string;
  rarity: string;
  //collectionId: string;
  categoryId: string;
  category: Category;
  //probability: number;
  //inventory: number;
  //initialInventory: number;
  //appearance: number;
  status: 'active' | 'inactive';
}
