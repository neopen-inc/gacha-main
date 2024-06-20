import { createAsyncThunk } from "@reduxjs/toolkit";
import { PostUserAddressDto } from "../dto/user-address.dto";
import { deleteUserAddress, fetchUserAddressesById, fetchUserAddressesByUserId, patchUserAddress, postUserAddress } from "../api/user-address.api";
import { UserAddress } from "../types";


export const prepareRemoveAddress = createAsyncThunk<{ userId: string, addressId: string }, { userId: string, addressId: string }>(
  'user/address/prepare-remove-address',
  async (payload) => {
    return payload
  },
);

export const cancelRemoveAddress = createAsyncThunk<void, void>(
  'user/address/cancel-delete',
  async (): Promise<void> => {
    return
  }
);


export const prepareUpdateAddress = createAsyncThunk<UserAddress, UserAddress>(
  'user/confirm-update-address',
  async (payload) => {
    return payload
  },
);

export const prepareCreateAddress = createAsyncThunk<void, void>(
  'user/confirm-create-address',
  async () => {
    return
  },
);

export const clearCreateAddress = createAsyncThunk<void, void>(
  'user/clear-create-address',
  async () => {
    return
  },
);

export const clearUpdateAddress = createAsyncThunk<void, void>(
  'user/clear-update-address',
  async () => {
    return
  },
);
export const clearRemoveAddress = createAsyncThunk<void, void>(
  'user/clear-remove-address',
  async () => {
    return
  },
);

export const createUserAddress = createAsyncThunk<UserAddress, { userId: string, address: PostUserAddressDto }>(
  'user/address/create',
  async ({ userId, address }: { userId: string, address: PostUserAddressDto }): Promise<UserAddress> => {
    return postUserAddress(userId, address);
  }
);

export const fetchUserAddresses = createAsyncThunk<UserAddress[], string>(
  'user/address/list',
  async (userId: string): Promise<UserAddress[]> => {
    return fetchUserAddressesByUserId(userId);
  }
);

export const fetchUserAddressById = createAsyncThunk<UserAddress, { userId: string, addressId: string }>(
  'user/address/get',
  async ({ userId, addressId }: { userId: string, addressId: string }): Promise<UserAddress> => {
    return fetchUserAddressesById(userId, addressId);
  }
);

export const removeUserAddress = createAsyncThunk<void, { userId: string, addressId: string }>(
  'user/address/delete',
  async ({ userId, addressId }: { userId: string, addressId: string }): Promise<void> => {
    return deleteUserAddress(userId, addressId);
  }
);

export const updateUserAddress = createAsyncThunk<UserAddress, { userId: string, addressId: string, address: PostUserAddressDto }>(
  'user/address/update',
  async ({ userId, addressId, address }: { userId: string, addressId: string, address: PostUserAddressDto }): Promise<UserAddress> => {
    return patchUserAddress(userId, addressId, address);
  }
);
