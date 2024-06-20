import { axiosInstance } from "@gacha-nango-app/util/axios";
import { GetShippingListQueryDto, PatchShippingDto, PostShippingDto } from "../dto/shipping.dto";
import { Shipping } from "../types/shipping.type";
import { types } from "@common-utils";


export async function postShipping(
  postShippingDto: PostShippingDto
) {
  const res = await axiosInstance.post<Shipping>(
    '/shippings',
    postShippingDto,
  );
  return res.data;
}

export async function getShippings(shippingListDto?: GetShippingListQueryDto) {
  const res = await axiosInstance.get<types.Paginated<Shipping>>(`/shippings`, {
    params: shippingListDto || {}
  });
  return res.data;
}

export async function getShippingById(id: string) {
  const res = await axiosInstance.get<Shipping>(`/shippings/${id}`);
  return res.data;
}

export async function patchShippingById(shippingId: string, patchShippingDto: PatchShippingDto) {
  const res = await axiosInstance.patch<Shipping>(`/shippings/${shippingId}`, patchShippingDto);
  return res.data;
}