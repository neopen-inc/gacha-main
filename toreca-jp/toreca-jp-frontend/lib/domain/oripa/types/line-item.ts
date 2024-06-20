import { Card } from "./card";
import { CardToOripa } from "./card-to-oripa";
import { Collection } from "./collection";
import { Gacha } from "./gacha";

export interface LineItem {
  id: string;
  card: Card;
  cardToOripa: CardToOripa;
  collection: Collection;
  gacha: Gacha;
  userId: string;
  createdAt: Date;
}
