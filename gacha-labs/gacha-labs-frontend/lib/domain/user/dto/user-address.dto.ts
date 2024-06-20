import { UserAddress } from "../types";

export type PostUserAddressDto = Omit<UserAddress, 'id' | 'user' >;
export type PatchUserAddressDto = Partial<PostUserAddressDto>;