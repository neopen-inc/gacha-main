import { User } from "@gacha-labs-app/domain/types";
import { LineItem } from "./line-item";

export interface Gacha {
  collectionId: string;
  userId: string;
  type: 'one' | 'ten';
  lineItems: LineItem[];
  user: User;
}
