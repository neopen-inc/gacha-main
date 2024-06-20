import { PointPackage } from "@cardpia-app/domain/point/types/point-package.type";
import { User } from "@cardpia-app/domain/types";

export interface Payment {
  id: string;
  sessionId: string;
  pointPackage: PointPackage;
  user: User;
  status: string;
  createdAt: Date;
}
