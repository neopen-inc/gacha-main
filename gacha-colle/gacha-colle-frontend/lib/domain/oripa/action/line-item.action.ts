import { createAsyncThunk } from "@reduxjs/toolkit";
import { LineItem } from "../types/line-item";
import { getUserLineItems, getWaitForShipGroups, patchReturnItem, patchReturnItems } from "../api/line-item.api";
import { GetUserLineItemsQueryDto, ReturnItemResponse, WaitingForShip } from "../dto";
import { types } from "@common-utils";
import { PostShippingDto } from '../../shipping/dto/shipping.dto';

export const fetchUserLineItems = createAsyncThunk<{ status?: string, lineItemResult: types.Paginated<LineItem> }, { userId: string, query: GetUserLineItemsQueryDto }>(
  'line-item/fetch-my-line-items',
  async ({ userId, query }: { userId: string, query?: GetUserLineItemsQueryDto }) => {
    const lineItemResult = await getUserLineItems(userId, query);
    return {
      status: query?.status,
      lineItemResult
    };
  }
)

export type TYPE_OPERATIONS =  'returnItem'

export const returnItem = createAsyncThunk<ReturnItemResponse, { userId: string, lineItemId: string }>(
  'line-item/return-item',
  async ({ userId, lineItemId }: { userId: string, lineItemId: string }) => {
    return await patchReturnItem(userId, lineItemId);
  }
)

export const waitForShipGroups = createAsyncThunk<WaitingForShip[]>(
  'line-item/wait-for-ship-groups',
  async () => {
    return await getWaitForShipGroups();
  }
)

export const returnMany = createAsyncThunk<void, { userId: string, lineItems: string[] }>(
  'line-item/return-many',
  async ({ userId, lineItems }: { userId: string, lineItems: string[] }) => {
    await patchReturnItems(userId, lineItems);
  }
)

export const clearOperationStatus = createAsyncThunk<TYPE_OPERATIONS, TYPE_OPERATIONS>(
  'line-item/clear-operation-status',
  async (operation: TYPE_OPERATIONS): Promise<TYPE_OPERATIONS> => {
    return operation
  },
)

export const prepareReturnItem = createAsyncThunk<Omit<PostShippingDto, 'addressId'>, Omit<PostShippingDto, 'addressId'>>(
  'line-item/click-return-item',
  async (dto: Omit<PostShippingDto, 'addressId'>) => {
    return dto;
  },
)

export const clearReturnItem = createAsyncThunk<void, void>(
  'line-item/clear-return-item',
  async () => {
    return ;
  },
)

