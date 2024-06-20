import { LineItem } from "@toreca-jp-app/domain/oripa/types/line-item";
import { UserAddress } from "@toreca-jp-app/domain/user/types";

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
