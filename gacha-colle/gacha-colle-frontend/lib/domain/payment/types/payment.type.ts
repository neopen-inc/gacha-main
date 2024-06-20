import { PointPackage } from "@gacha-colle-app/domain/point/types/point-package.type";
import { User } from "@gacha-colle-app/domain/types";

export interface Payment {
  id: string;
  sessionId: string;
  pointPackage: PointPackage;
  user: User;
  status: string;
  createdAt: Date;
}
