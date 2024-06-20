import { dto } from '@common-utils';
import { LineItem } from "../types/line-item";

export interface GetUserLineItemsQueryDto extends dto.GetListQueryDto {
  status?: string;
}

export interface WaitingForShip {
  userId: string;
  item: LineItem;
}

export interface ReturnItemResponse {
  points: number;
}
