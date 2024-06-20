import { Card } from "./card";
import { Collection } from "./collection";
import { Gacha } from "./gacha";

export interface LineItem {
  id: string;
  card: Card;
  collection: Collection;
  gacha: Gacha;
  userId: string;
  createdAt: Date;
}
