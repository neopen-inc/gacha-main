import { PointPackage } from "@toreca-jp-app/domain/point/types/point-package.type";
import { User } from "@toreca-jp-app/domain/user/types";

export interface Payment {
  id: string;
  sessionId: string;
  pointPackage: PointPackage;
  user: User;
  status: string;
  createdAt: Date;
}
