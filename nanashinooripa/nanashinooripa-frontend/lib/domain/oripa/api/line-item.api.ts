import { axiosInstance } from "@nanashinooripa-app/util/axios";
import { LineItem } from "../types/line-item";
import { GetUserLineItemsQueryDto, ReturnItemResponse, WaitingForShip } from "../dto/line-item";
import { types } from "@common-utils";

export async function getUserLineItems(userId: string, params?: GetUserLineItemsQueryDto) {
  return await axiosInstance.get<types.Paginated<LineItem>>(`/line-items/users/${userId}`, { params: params || {} }).then((res) => { return res.data });
}

export async function patchReturnItem(userId: string, lineItemId: string): Promise<ReturnItemResponse> {
  return await axiosInstance.patch<ReturnItemResponse>(`/line-items/users/${userId}/return/${lineItemId}`).then(res => res.data);
}

export async function patchRequestShip(userId: string, lineItemId: string) {
  return await axiosInstance.patch(`/line-items/users/${userId}/request-ship/${lineItemId}`);
}


export async function getWaitForShipGroups() {
  return await axiosInstance.get<WaitingForShip[]>(`/line-items/groups/waiting-for-ship`).then((res) => { return res.data });
}

export async function patchReturnItems(userId: string, lineItems: string[]) {
  return await axiosInstance.patch(`/line-items/users/${userId}/return-many`, { idList: lineItems }).then(res => res.data);
}
