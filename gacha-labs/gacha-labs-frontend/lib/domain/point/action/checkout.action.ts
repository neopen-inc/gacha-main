import { createAsyncThunk } from "@reduxjs/toolkit";
import { postCheckoutSession, postCheckoutSuccess } from "../api/point-transaction.api";


export const createCheckoutSession = createAsyncThunk<
  { url: string },
  { userId: string; pointPackageId: string }
>('point/create-checkout-session', async ({ userId, pointPackageId }) => {
  const sessionId = await postCheckoutSession(userId, pointPackageId)
  return sessionId
});


export const createCheckoutSuccess = createAsyncThunk<void, string>('point/create-checkout-success', async (sessionId: string) => {
  postCheckoutSuccess(sessionId);
});
