import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetShippingListQueryDto, PatchShippingDto, PostShippingDto } from "../dto/shipping.dto";
import { Shipping } from "../types/shipping.type";
import { getShippingById, getShippings, patchShippingById, postShipping } from "../api/shipping.api";
import { types } from "@common-utils";


export const clearCreateShipping = createAsyncThunk<void, void>(
  'shipping/clear-create-shipping',
  async () => {
    return ;
  }
)

export const createShipping = createAsyncThunk<Shipping, PostShippingDto>(
  'shipping/create-shipping',
  async (PostShippingDto: PostShippingDto) => {
    return await postShipping(PostShippingDto);
  }
)

export const prepareCreateShipping = createAsyncThunk<PostShippingDto, PostShippingDto>(
  'shipping/prepare-create-shipping',
  async (postShippingDto: PostShippingDto) => {
    return postShippingDto
  }
);

export const updateShipping = createAsyncThunk<Shipping, { shippingId: string, patchShippingDto: PatchShippingDto }>(
  'shipping/update-shipping',
  async ({ shippingId, patchShippingDto }: { shippingId: string, patchShippingDto: PatchShippingDto }) => {
    return await patchShippingById(shippingId, patchShippingDto);
  }
)

export const prepareUpdateShipping = createAsyncThunk<Shipping, Shipping>(
  'shipping/prepare-update-shipping',
  async (shipping: Shipping) => {
    return shipping;
  }
)


export const clearUpdateShipping = createAsyncThunk<void, void>(
  'shipping/clear-update-shipping',
  async () => {
    return ;
  }
)


export const fetchShippingById = createAsyncThunk<Shipping, string>(
  'shipping/fetch-shippingp-by-id',
  async (id: string) => {
    return await getShippingById(id);
  }
)

export const fetchShippings = createAsyncThunk<types.Paginated<Shipping>, GetShippingListQueryDto>(
  'shipping/fetch-shippings',
  async (shippingListDto?: GetShippingListQueryDto) => {
    return await getShippings(shippingListDto);
  }
)