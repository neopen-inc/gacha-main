import { PointPackage } from "@gacha-land-app/domain/point/types/point-package.type";
import { User } from "@gacha-land-app/domain/types";

export interface Payment {
  id: string;
  sessionId: string;
  pointPackage: PointPackage;
  user: User;
  status: string;
  createdAt: Date;
}
