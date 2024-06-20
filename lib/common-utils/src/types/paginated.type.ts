
export interface Paginated<T> {
  total: number;
  count: number;
  offset: number;
  limit: number;
  data: T[];
}