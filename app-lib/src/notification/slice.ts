import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { NotificationDisplayConfig } from './type'

export const showNotification = createAsyncThunk<NotificationDisplayConfig, NotificationDisplayConfig>(
  'page/show-notification',
  async (message: NotificationDisplayConfig) => {
    return message
  }
)

export const hideNotification = createAsyncThunk<void, void>(
  'page/hide-notification',
  async () => {
    return ;
  }
)

export interface NotificationState {
  notification: NotificationDisplayConfig
}

const initialState: NotificationState = {
  notification: {
    message: '',
    shouldShow: false,
    severity: undefined,
    displayMilliseconds: 3000
  }
}

export const notificationSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(showNotification.fulfilled, (state, action) => {
      state.notification = {
        displayMilliseconds: 3000,
        shouldShow: true,
        severity: 'info',
        ...action.payload,
      }
    }).addCase(hideNotification.fulfilled, (state, action) => {
      state.notification = {
        message: '',
        shouldShow: false,
        severity: undefined,
        displayMilliseconds: 3000
      };
    });
  }
})
