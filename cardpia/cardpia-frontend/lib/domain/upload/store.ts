import { types } from "@common-utils";
import { createSlice } from "@reduxjs/toolkit";
import { uploadBase64File } from "./action/upload.action";


export interface UploadState {
  operations: {
    uploadBase64File: types.Operation<{ url: string }>
  }
}

const initialState: UploadState = {
  operations: {
    uploadBase64File: {
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
    builder.addCase(uploadBase64File.fulfilled, (state, { payload }) => {
      state.operations.uploadBase64File = {
        status: 'succeeded',
        payload
      }
    }).addCase(uploadBase64File.rejected, (state, { payload }) => {
      state.operations.uploadBase64File = {
        status: 'failed',
        message: '画像のアップロードに失敗しました。'
      }
    }).addCase(uploadBase64File.pending, (state, { payload }) => {
      state.operations.uploadBase64File = {
        status: 'busy'
      }
    });
  }
});

export default uploadSlice.reducer;