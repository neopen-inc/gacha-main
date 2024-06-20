import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPayments } from "../api/payment.api";
import { GetPaymentsQueryDto } from "../dto/payment.dto";
import { Payment } from "../types/payment.type";
import { types } from "@common-utils";

export const fetchPayments = createAsyncThunk<types.Paginated<Payment>, GetPaymentsQueryDto>('point/get-payments', async (options: any) => {
  const payments = await getPayments(options);
  return payments;
});

