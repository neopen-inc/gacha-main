import { User } from "@toreca-jp-app/domain/user/types";
import { LineItem } from "./line-item";

export interface Gacha {
  collectionId: string;
  userId: string;
  type: 'one' | 'ten';
  lineItems: LineItem[];
  user: User;
}
