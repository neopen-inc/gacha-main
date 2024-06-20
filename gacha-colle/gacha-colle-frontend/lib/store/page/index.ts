import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface ShowMessage {
  message: string
  show: boolean
  severity: 'success' | 'info' | 'warning' | 'error' | undefined
};

export const setPageTitle = createAsyncThunk(
  'page/setPageTitle',
  async (title: string) => {
    return title
  }
)
export const setReturnPage = createAsyncThunk(
  'page/setReturnPage',
  async (title: string) => {
    return title
  }
)

export const showMessage = createAsyncThunk<ShowMessage, ShowMessage>(
  'page/showMessage',
  async (message: ShowMessage) => {
    return message
  }
)

export interface PointState {
  pageTitle: string
  returnPage: string
  showMessage: ShowMessage
}

const initialState: PointState = {
  pageTitle: '',
  returnPage: '',
  showMessage: {
    message: '',
    show: false,
    severity: undefined
  }
}

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setPageTitle.fulfilled, (state, action) => {
      state.pageTitle = action.payload
    })
    builder.addCase(setReturnPage.fulfilled, (state, action) => {
      state.returnPage = action.payload
    })
    builder.addCase(showMessage.fulfilled, (state, action) => {
      state.showMessage = action.payload
      if (action.payload.show) {
        setTimeout(() => {
          state.showMessage = {
            message: '',
            show: false,
            severity: undefined
          }
        }, 3000)
      }
    });
  }
})

export default pageSlice.reducer
