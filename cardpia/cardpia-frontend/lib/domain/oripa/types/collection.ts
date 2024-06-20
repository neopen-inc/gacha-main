
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
  once: boolean;
  oncePerDay: boolean;
  pickup: number;
  seq: number;
}
