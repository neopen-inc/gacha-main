import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteUserById, getUsers, patchUserById, postLogin, postUser } from "../api/user.api";
import { LoginResponse, PostLoginDto } from "../dto/login.dto";
import { GetUserListOptions, PostUserDto, UpdateUserDto } from "../dto/user.dto";
import { types } from "@common-utils";
import { User } from "../types";

export const registerUser = createAsyncThunk(
  'user/register',
  async (registerInfo: PostUserDto) => {
    return await postUser(registerInfo);
  }
)

export const updateUser = createAsyncThunk<void, {userId: string, updateUserDto: UpdateUserDto}>(
  'user/update',
  async ({userId, updateUserDto}: { userId: string, updateUserDto: UpdateUserDto}) => {
    await patchUserById(userId, updateUserDto);
  }
)

export const loginUser = createAsyncThunk<LoginResponse, PostLoginDto>(
  'user/login',
  async (loginInfo: PostLoginDto): Promise<LoginResponse> => {
    return await postLogin(loginInfo);
  }
)


export const fetchUsers = createAsyncThunk<types.Paginated<User>, GetUserListOptions>(
  'users/list',
  async (dto): Promise<types.Paginated<User>> => {
    return await getUsers(dto);
  }
);


export const removeUsers = createAsyncThunk<void, string>(
  'users/remove',
  async (userId: string) => {
    await deleteUserById(userId);
  }
);

export const prepareRemoveUsers = createAsyncThunk<User, User>(
  'users/prepare-remove',
  async (user: User) => {
    return user;
  }
);

export const clearPrepareRemoveUsers = createAsyncThunk<void>(
  'users/clear-prepare-remove',
  async () => {
    return ;
  }
);

