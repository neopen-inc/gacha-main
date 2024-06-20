import { UserAddress } from "../types/user.type";

export type PostUserAddressDto = Omit<UserAddress, 'id' | 'user' >;
export type PatchUserAddressDto = Partial<PostUserAddressDto>;