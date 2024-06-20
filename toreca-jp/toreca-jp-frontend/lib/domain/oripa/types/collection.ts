export interface Collection {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  background: string;
  subImages: string;
  status: 'active' | 'inactive';
  categoryId: string;
  gacha1Points: number;
  gacha10Points: number;
  seq: number;
}