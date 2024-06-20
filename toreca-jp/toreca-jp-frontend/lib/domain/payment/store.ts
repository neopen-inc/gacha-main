

import { Operation } from "@toreca-jp-app/store/types";
import { createSlice } from "@reduxjs/toolkit";
import { fetchPayments } from "./action/payment.action";
import { Payment } from "./types/payment.type";
import { types } from "@common-utils";


export interface PaymentState {
  operations: {
    fetchPayments: Operation<types.Paginated<Payment>>
  }
}

const initialState: PaymentState = {
  operations: {
    fetchPayments: {
      status: 'idle'
    }
  }
}

export const paymentSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPayments.fulfilled, (state, action) => {
      state.operations.fetchPayments = {
        status: 'succeeded',
        payload: action.payload
      }
    });
  }
});

export default paymentSlice.reducer;

