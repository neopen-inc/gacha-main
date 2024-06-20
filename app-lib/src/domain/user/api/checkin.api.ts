import { axiosInstance } from "@gacha-colle-app/util/axios";
import { AxiosResponse } from "axios";
import { Checkin } from "../types";

export async function postCheckin(userId: string): Promise<AxiosResponse<Checkin>> {
  return axiosInstance.post<Checkin>(`/user-checkin`, { userId });
}
