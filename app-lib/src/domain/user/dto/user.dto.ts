import { GetListQueryDto } from "@common-utils/dto/get-list-query.dto";
import { User } from "../types/user.type";

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