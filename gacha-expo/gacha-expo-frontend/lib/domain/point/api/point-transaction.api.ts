import { axiosInstance } from "@gacha-expo-app/util/axios";
import { PointTransaction } from "../types/point-transaction.type";
import { PostPointTransactionDto } from "../dto/point-transaction.dto";

export async function postPointTransaction(userId: string, createPointTransactionDto: PostPointTransactionDto): Promise<PointTransaction> {
  return await axiosInstance.post<PointTransaction>(`/users/${userId}/point-transactions`, createPointTransactionDto).then((res) => res.data);
}

export async function postCheckoutSession(userId: string, packageId: string): Promise<{url: string}> {
  return await axiosInstance.post<{url: string}>(`/point-packages/checkout-session`, { userId, packageId }).then((res) => res.data);
}

export async function postCheckoutSuccess(sessionId: string): Promise<void> {
  await axiosInstance.post<void>(`/point-packages/checkout-success`, { sessionId });
}
