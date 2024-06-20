export interface Category {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  logo: string;
  seq: number;
  status: 'active' | 'inactive';
}
