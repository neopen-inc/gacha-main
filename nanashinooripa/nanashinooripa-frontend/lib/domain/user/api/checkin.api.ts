import { axiosInstance } from "@nanashinooripa-app/util/axios";
import { AxiosResponse } from "axios";
import { Checkin } from "../types";

export async function postCheckin(userId: string): Promise<AxiosResponse<Checkin>> {
  return axiosInstance.post<Checkin>(`/user-checkin`, { userId });
}
