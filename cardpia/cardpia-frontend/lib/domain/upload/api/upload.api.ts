import { axiosInstance } from "@cardpia-app/util/axios";


export async function postUploadBase64(fileBase64: string): Promise<{ url: string }> {
  return await axiosInstance
    .post<{ url: string }>(`/upload/base64`, { fileBase64 })
    .then((res) => res.data)
}
