import { GetListQueryDto } from "lib/common-utils/src/dto";
import { User } from "../types";

export interface PostUserDto {
  name: string;
  email: string;
  password: string;
}

export type RegisterResponse = User;

export interface UpdateUserDto {
  defaultAddressId: string;
}

export interface GetUserListOptions extends GetListQueryDto {
  name?: string;
  email?: string;
}