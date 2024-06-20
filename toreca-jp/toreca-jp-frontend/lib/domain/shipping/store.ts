import { createSlice } from "@reduxjs/toolkit";
import { Shipping } from "./types/shipping.type";
import { clearCreateShipping, clearUpdateShipping, createShipping, fetchShippingById, fetchShippings, prepareCreateShipping, prepareUpdateShipping, updateShipping } from "./action/shipping.action";
import { types } from "@common-utils";
import { PostShippingDto } from "./dto";

export interface ShippingState {
  operations: {
    fetchShippings: types.Operation<types.Paginated<Shipping>>
    fetchShippingById: types.Operation<Shipping>
    createShipping: types.Operation<PostShippingDto>
    updateShipping: types.Operation<Shipping>
  }
}

const initialState: ShippingState = {
  operations: {
    fetchShippings: {
      status: 'idle'
    },
    fetchShippingById: {
      status: 'idle'
    },
    createShipping: {
      status: 'idle'
    },
    updateShipping: {
      status: 'idle'
    }
  }
}

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(createShipping.fulfilled, (state, action) => {
      state.operations.createShipping = {
        status: 'succeeded',
        message: '商品の発送依頼を承りました',
      }
    }).addCase(createShipping.rejected, (state, action) => {
      state.operations.createShipping = {
        status: 'failed',
        message: '商品の発送依頼が失敗しました',
      }
    }).addCase(createShipping.pending, (state, action) => {
      state.operations.createShipping = {
        status: 'busy',
      }
    }).addCase(prepareCreateShipping.fulfilled, (state, action) => {
      state.operations.createShipping = {
        status: 'confirm',
        payload: action.payload,
      }
    }).addCase(clearCreateShipping.fulfilled, (state) => {
      state.operations.createShipping = {
        status: 'idle',
      }
    });
    builder.addCase(fetchShippings.fulfilled, (state, action) => {
      state.operations.fetchShippings = {
        status: 'succeeded',
        payload: action.payload,
      }
    }).addCase(fetchShippings.rejected, (state, action) => {
      state.operations.fetchShippings = {
        status: 'failed',
      }
    }).addCase(fetchShippings.pending, (state, action) => {
      state.operations.fetchShippings = {
        status: 'busy',
      }
    }).addCase(fetchShippingById.fulfilled, (state, action) => {
      state.operations.fetchShippingById = {
        status: 'succeeded',
        payload: action.payload,
      }
    }).addCase(fetchShippingById.rejected, (state, action) => {
      state.operations.fetchShippingById = {
        status: 'failed',
      }
    }).addCase(fetchShippingById.pending, (state, action) => {
      state.operations.fetchShippingById = {
        status: 'busy',
      }
    });

    builder.addCase(updateShipping.fulfilled, (state, action) => {
      state.operations.updateShipping = {
        status: 'succeeded',
        payload: action.payload,
      }
    }).addCase(prepareUpdateShipping.fulfilled, (state, action) => {
      state.operations.updateShipping = {
        status: 'confirm',
        payload: action.payload,
      }
    }).addCase(clearUpdateShipping.fulfilled, (state) => {
      state.operations.updateShipping = {
        status: 'idle',
        payload: undefined,
      }
    });
  }
});

export default uploadSlice.reducer;