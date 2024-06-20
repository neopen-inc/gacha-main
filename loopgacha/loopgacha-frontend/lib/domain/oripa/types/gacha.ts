import { User } from "@loopgacha-app/domain/types";
import { LineItem } from "./line-item";

export interface Gacha {
  collectionId: string;
  userId: string;
  type: 'one' | 'ten';
  lineItems: LineItem[];
  user: User;
}
