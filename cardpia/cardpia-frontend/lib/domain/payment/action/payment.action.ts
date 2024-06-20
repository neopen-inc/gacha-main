import { createAsyncThunk } from "@reduxjs/toolkit";
import { deletePaymentById, getPayments } from "../api/payment.api";
import { GetPaymentsQueryDto } from "../dto/payment.dto";
import { Payment } from "../types/payment.type";
import { types } from "@common-utils";

export const fetchPayments = createAsyncThunk<types.Paginated<Payment>, GetPaymentsQueryDto>('payment/get-payments', async (options: any) => {
  const payments = await getPayments(options);
  return payments;
});

export const removePaymentById = createAsyncThunk<void, string>('payment/remove-payment-by-id', async (id: string) => {
  await deletePaymentById(id);
});

export const prepareRemovePaymentById = createAsyncThunk<Payment, Payment>('payment/prepare-remove-payment-by-id', async (payment: Payment) => {
  return payment;
});

export const clearRemovePaymentById = createAsyncThunk<void, void>('payment/clear-remove-payment-by-id', async () => {
  return;
});
