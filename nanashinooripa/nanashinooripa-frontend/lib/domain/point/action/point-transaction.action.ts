import { createAsyncThunk } from "@reduxjs/toolkit";
import { PostPointTransactionDto } from "../dto/point-transaction.dto";
import { PointTransaction } from "../types/point-transaction.type";
import { postPointTransaction } from "../api/point-transaction.api";


export const createPointTransaction = createAsyncThunk<
  PointTransaction,
  { userId: string; postPointTransactionDto: PostPointTransactionDto }
>(
  'point/create-point-transaction',
  async ({
    userId,
    postPointTransactionDto,
  }: {
    userId: string
    postPointTransactionDto: PostPointTransactionDto
  }) => {
    const pointTransaction = await postPointTransaction(
      userId,
      postPointTransactionDto,
    )
    return pointTransaction
  },
)


export const prepareCreatePointTransaction = createAsyncThunk<string, string>(
  'point/prepare-create-point-transaction',
  async (userId: string) => {
    return userId;
  },
)

export const clearCreatePointTransaction = createAsyncThunk<void, void>(
  'point/clear-create-point-transaction',
  async () => {},
)
