export interface PointTransaction {
  id: string
  type: string;
  amount: number;
  reason: string;
  pointPackageId?: string;
}
