import { LoginResponse, PostCheckTokenDto, PostLoginDto } from '@gacha-nango-app/domain/user/dto/login.dto';
import { axiosInstance } from '@gacha-nango-app/util/axios';
import { AxiosResponse } from 'axios';
import { User } from '../types/user.type';
import { GetUserListOptions, PostUserDto } from '../dto/user.dto';
import { UpdateUserDto } from '../dto/user.dto';
import { types } from '@common-utils';

export async function postUser(postCreateUserDto: PostUserDto): Promise<User> {
  return new Promise((resolve, reject) => {
    axiosInstance.post<User>('/users', postCreateUserDto).then((res) => resolve(res.data)).
      catch(error => {
        if (error.response) {
          reject({
            data: error.response.data,
            status: error.response.status,
            headers: error.response.headers
          });
        } else {
          reject({
            status: 500,
            data: {
              message: error.message,
            }
          })
        }
      });
  });
}

export async function getUsers(params: GetUserListOptions): Promise<types.Paginated<User>> {
  return await axiosInstance.get<types.Paginated<User>>('/users', { params }).then((res) => res.data);
}

export async function getUserById(id: string): Promise<User> {
  return await axiosInstance.get<User>(`/users/${id}`).then((res) => res.data);
}

export async function patchUserById(id: string, user: UpdateUserDto): Promise<User> {
  return await axiosInstance.patch<User>(`/users/${id}`, user).then((res) => res.data);
}

export async function deleteUserById(id: string): Promise<void> {
  return await axiosInstance.delete(`/users/${id}`);
}

export async function postLogin(loginDto: PostLoginDto): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    axiosInstance.post<LoginResponse>('/auth/login', loginDto).then((res) => resolve(res.data)).
      catch(error => {
        if (error.response) {
          reject({
            data: error.response.data,
            status: error.response.status,
            headers: error.response.headers
          });
        } else {
          reject({
            status: 500,
            data: {
              message: error.message,
            }
          })
        }
      });
  });
}

export async function postCheckToken(checkTokenDto: PostCheckTokenDto): Promise<AxiosResponse<{ id: string }>> {
  return await axiosInstance.post<{ id: string }>('/check-token', checkTokenDto);
}

export async function postSendVerificationEmail(id: string): Promise<void> {
  axiosInstance.post<void>(`/users/${id}/send-verification-email`);
}

export async function postVerifyEmail(id: string, token: string): Promise<LoginResponse> {
  return await axiosInstance.post<LoginResponse>(`/users/${id}/verify-email`, { token }).then(res => res.data);
}

export async function postResetPassword(token: string, password: string): Promise<void> {
  axiosInstance.post<void>('/users/reset-password', { token, password });
}

export async function postSendResetPasswordEmail(email: string): Promise<void> {
  axiosInstance.post<void>('/users/send-reset-password-email', { email });
}
