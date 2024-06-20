import { PointTransaction } from "../types/point-transaction.type";

export type PostPointTransactionDto = Omit<PointTransaction, 'id'>
export type PatchPointTransactionDto = Partial<PostPointTransactionDto>