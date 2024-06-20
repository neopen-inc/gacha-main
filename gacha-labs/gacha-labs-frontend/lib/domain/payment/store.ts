import { createSlice } from "@reduxjs/toolkit";
import { clearRemovePaymentById, fetchPayments, prepareRemovePaymentById, removePaymentById } from "./action/payment.action";
import { Payment } from "./types/payment.type";
import { types } from "@common-utils";

export interface PaymentState {
  operations: {
    fetchPayments: types.Operation<types.Paginated<Payment>>
    removePaymentById: types.Operation<Payment>
  }
}

const initialState: PaymentState = {
  operations: {
    fetchPayments: {
      status: 'idle'
    },
    removePaymentById: {
      status: 'idle',
    }
  }
}

export const paymentSlice = createSlice({
  name: 'payment',
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
    builder.addCase(prepareRemovePaymentById.fulfilled, (state, { payload }) => {
      state.operations.removePaymentById = {
        status: 'confirm',
        payload
      }
    }).addCase(clearRemovePaymentById.fulfilled, (state) => {
      state.operations.removePaymentById = {
        status: 'idle'
      };
    });
    builder.addCase(removePaymentById.pending, (state) => {
      state.operations.removePaymentById = {
        status: 'busy'
      }
    }).addCase(removePaymentById.rejected, (state) => {
      state.operations.removePaymentById = {
        status: 'failed'
      }
    }).addCase(removePaymentById.fulfilled, (state) => {
      state.operations.removePaymentById = {
        status: 'succeeded'
      }
    });
  }
});

export default paymentSlice.reducer;

