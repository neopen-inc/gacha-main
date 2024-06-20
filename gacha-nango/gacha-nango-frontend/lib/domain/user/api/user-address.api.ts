import { axiosInstance } from "@gacha-nango-app/util/axios";
import { PatchUserAddressDto, PostUserAddressDto } from "../dto/user-address.dto";
import { UserAddress } from "../types";

export async function postUserAddress(userId: string, address: PostUserAddressDto): Promise<UserAddress> {
  return await axiosInstance.post<UserAddress>(`/users/${userId}/addresses`, address).then((res) => res.data);
}

export async function fetchUserAddressesByUserId(userId: string): Promise<UserAddress[]> {
  return await axiosInstance.get<UserAddress[]>(`/users/${userId}/addresses`).then((res) => res.data);
}

export async function fetchUserAddressesById(userId: string, addressId: string): Promise<UserAddress> {
  return await axiosInstance.get<UserAddress>(`/users/${userId}/addresses/${addressId}`).then((res) => res.data);
}


export async function deleteUserAddress(userId: string, addressId: string): Promise<void> {
  return await axiosInstance.delete(`/users/${userId}/addresses/${addressId}`);
}

export async function getUserAddressById(userId: string, addressId: string): Promise<UserAddress> {
  return await axiosInstance.get<UserAddress>(`/users/${userId}/addresses/${addressId}`).then((res) => res.data);
}

export async function patchUserAddress(userId: string, addressId: string, address: PatchUserAddressDto): Promise<UserAddress> {
  return await axiosInstance.patch<UserAddress>(`/users/${userId}/addresses/${addressId}`, address).then((res) => res.data);
}
