import { LineItem } from "@gacha-colle-app/domain/oripa/types/line-item";
import { UserAddress } from "@gacha-colle-app/domain/types";

export interface Shipping {
  id: string;
  userId?: string;
  addressId?: string;
  user: { email: string };
  address: UserAddress;
  addressInfo: string;
  lineItems: LineItem[];
  trackingNumber: string;
  status: string;
  createdAt : string;
  updatedAt: string;
  shippedAt: string;
}
