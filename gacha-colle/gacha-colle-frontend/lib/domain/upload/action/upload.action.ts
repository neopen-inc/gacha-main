import { createAsyncThunk } from "@reduxjs/toolkit"
import { postUploadBase64 } from "../api/upload.api"

export const uploadBase64File = createAsyncThunk<{ url: string }, string>(
  'upload/upload-base64-file',
  async (base64: string): Promise<{ url: string }> => {
    return await postUploadBase64(base64)
  },
)
