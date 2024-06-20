import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PointPackage } from './types/point-package.type'
import { clearCreatePointPackage, clearRemovePointPackage, clearUpdatePointPackage, createPointPackage, fetchPointPackages, prepareCreatePointPackage, prepareRemovePointPackage, prepareUpdatePointPackage, removePointPackage, updatePointPackage } from './action/point-package.action'
import { Operation } from '@toreca-jp-app/store/types';
import { clearCreatePointTransaction, createPointTransaction, prepareCreatePointTransaction } from './action/point-transaction.action';
import { PointTransaction } from './types/point-transaction.type';
import { Payment } from '../payment/types/payment.type';
import { createCheckoutSession, createCheckoutSuccess } from './action/checkout.action';
import { types } from '@common-utils';


type OperationType = 'createPointPackage' | 'deletePointPackage' | 'updatePointPackage'


export const clearPointOperationStatus = createAsyncThunk<OperationType, OperationType>('point/clear-operation-status', async (operation: OperationType) => {
  return operation;
});


export interface PointState {
  pointTransaction: {
    pointTransaction: PointTransaction | undefined
    pointTransactions: types.Paginated<PointTransaction>
  }
  payments: types.Paginated<Payment>,
  pointPackages: PointPackage[],
  pointPackage: PointPackage | undefined,
  operation: {
    createPointPackage: Operation<PointPackage>
    removePointPackage: Operation<PointPackage>
    updatePointPackage: Operation<PointPackage>
    fetchPointPackages: Operation<PointPackage[]>
    fetchPointPackageById: Operation<PointPackage>
    createPointTransaction: Operation<string>
  }
}

const initialState: PointState = {
  pointTransaction: {
    pointTransaction: undefined,
    pointTransactions: {
      total: 0,
      data: [],
      count: 0,
      limit: 0,
      offset: 0,
    },
  },
  pointPackage: undefined,
  pointPackages: [],
  payments: {
    total: 0,
    data: [],
    count: 0,
    limit: 0,
    offset: 0,
  },
  operation: {
    createPointPackage: {
      status: 'idle',
    },
    removePointPackage: {
      status: 'idle',
    },
    updatePointPackage: {
      status: 'idle',
    },
    fetchPointPackages: {
      status: 'idle',
    },
    fetchPointPackageById: {
      status: 'idle',
    },
    createPointTransaction: {
      status: 'idle'
    }
  }
}

export const pointSlice = createSlice({
  name: 'point',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    // create point package
    builder.addCase(createPointPackage.fulfilled, (state, action) => {
      state.operation.createPointPackage = {
        status: 'succeeded',
        payload: action.payload,
        message: 'パケッジを作成しました。'
      }
    }).addCase(createPointPackage.rejected, (state, action) => {
      state.operation.createPointPackage = {
        status: 'failed',
        message: 'パケッジの作成に失敗しました。'
      }
    }).addCase(createPointPackage.pending, (state, action) => {
      state.operation.createPointPackage = {
        status: 'busy'
      }
    }).addCase(prepareCreatePointPackage.fulfilled, (state, action) => {
      state.operation.createPointPackage = {
        status: 'confirm'
      }
    }).addCase(clearCreatePointPackage.fulfilled, (state) => {
      state.operation.createPointPackage = {
        status: 'idle',
      }
    });

    // update point package
    builder.addCase(updatePointPackage.fulfilled, (state, action) => {
      state.operation.updatePointPackage = {
        status: 'succeeded',
        message: 'パケッジを更新しました。'
      }
    }).addCase(updatePointPackage.rejected, (state, action) => {
      state.operation.updatePointPackage = {
        status: 'failed',
        message: 'パケッジの更新に失敗しました。'
      }
    }).addCase(updatePointPackage.pending, (state, action) => {
      state.operation.updatePointPackage = {
        status: 'busy'
      }
    }).addCase(prepareUpdatePointPackage.fulfilled, (state, action) => {
      state.operation.updatePointPackage = {
        status: 'confirm',
        payload: action.payload
      }
    }).addCase(clearUpdatePointPackage.fulfilled, (state) => {
      state.operation.updatePointPackage = {
        status: 'idle',
      }
    });

    // remove point package
    builder.addCase(removePointPackage.fulfilled, (state, action) => {
      state.operation.removePointPackage = {
        status: 'succeeded',
        message: 'パケッジを削除しました。'
      }
    }).addCase(removePointPackage.rejected, (state, action) => {
      state.operation.removePointPackage = {
        status: 'failed',
        message: 'パケッジの削除に失敗しました。'
      }
    }).addCase(removePointPackage.pending, (state, action) => {
      state.operation.removePointPackage = {
        status: 'busy'
      }
    }).addCase(prepareRemovePointPackage.fulfilled, (state, action) => {
      state.operation.removePointPackage = {
        status: 'confirm',
        payload: action.payload
      }
    }).addCase(clearRemovePointPackage.fulfilled, (state) => {
      state.operation.removePointPackage = {
        status: 'idle',
      }
    });

    // fetch point packages
    builder.addCase(fetchPointPackages.fulfilled, (state, action) => {
      state.operation.fetchPointPackages = {
        status: 'succeeded',
        message: 'パケッジを取得しました。',
        payload: action.payload
      }
    });

    builder.addCase(createPointTransaction.fulfilled, (state, action) => {
      state.operation.createPointTransaction = {
        status: 'succeeded',
        message: 'ポイントを付与しました。',
      }
    })
    .addCase(createPointTransaction.rejected, (state, action) => {
      state.operation.createPointTransaction = {
        status: 'failed',
        message: 'ポイントの付与が失敗しました。'
      }
    }).addCase(prepareCreatePointTransaction.fulfilled, (state, action) => {
      state.operation.createPointTransaction = {
        status: 'confirm',
        payload: action.payload
      }
    }).addCase(clearCreatePointTransaction.fulfilled, (state, action) => {
      state.operation.createPointTransaction = {
        status: 'idle'
      }
    });
    builder.addCase(createCheckoutSession.fulfilled, (state, action) => {
    }).addCase(createCheckoutSuccess.fulfilled, (state, action) => {
      
    });
  },
})

export default pointSlice.reducer
