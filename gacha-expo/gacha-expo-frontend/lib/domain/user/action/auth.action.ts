import { createAsyncThunk } from "@reduxjs/toolkit";
import { postResetPassword, postSendVerificationEmail, postVerifyEmail } from "../api/user.api";
import { LoginResponse } from "../dto";


export const sendVerificationEmail = createAsyncThunk<void, string>(
  'user/send-verification-email',
  async (email: string): Promise<void> => {
    postSendVerificationEmail(email);
  }
);

export const sendResetPasswordEmail = createAsyncThunk<void, string>(
  'user/send-reset-password-email',
  async (email: string): Promise<void> => {
    sendResetPasswordEmail(email);
  }
);

export const resetPassword = createAsyncThunk<void, { token: string, password: string }>(
  'user/reset-password',
  async ({ token, password }: { token: string, password: string }): Promise<void> => {
    postResetPassword(token, password);
  }
);

export const verifyEmail = createAsyncThunk<LoginResponse, { id: string, token: string }>(
  'user/verify-email',
  async ({ id, token }: { id: string, token: string }): Promise<LoginResponse> => {
    return postVerifyEmail(id, token);
  }
);


export const logout = createAsyncThunk<void, Storage>(
  'user/logout',
  async (storage: Storage): Promise<void> => {
    storage.removeItem('access_token');
    storage.removeItem('user_id');
  }
);
