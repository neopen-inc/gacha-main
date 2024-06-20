import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../domain/user/store';
import oripaReducer from '../domain/oripa/store';
import pointReducer from '../domain/point/store';
import pageReducer from './page';
import uploadReducer from '../domain/upload/store';
import paymentReducer from '../domain/payment/store';
import shippingReducer from '../domain/shipping/store';
import { notification } from '@commons';

const store = configureStore({
  reducer: {
    user: userReducer,
    oripa: oripaReducer,
    point: pointReducer,
    upload: uploadReducer,
    shipping: shippingReducer,
    payment: paymentReducer,
    page: pageReducer,
    notification: notification.notificationSlice.reducer
  },
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;