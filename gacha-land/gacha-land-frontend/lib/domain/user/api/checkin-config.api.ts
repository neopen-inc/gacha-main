import { axiosInstance } from "@gacha-land-app/util/axios";
import { AxiosResponse } from "axios";
import { CheckinConfig } from "../types";
import { PatchCheckinConfigDto, PostCheckinConfigDto } from "../dto";


export async function getCheckinConfigs(): Promise<AxiosResponse<CheckinConfig[]>> {
  return axiosInstance.get<CheckinConfig[]>(`/checkin-config`);
}

export async function getCheckinConfigById(id: string): Promise<AxiosResponse<CheckinConfig>> {
  return axiosInstance.get<CheckinConfig>(`/checkin-config/${id}`);
}

export async function postCheckinConfig(checkinConfig: PostCheckinConfigDto): Promise<AxiosResponse<CheckinConfig>> {
  return axiosInstance.post<CheckinConfig>(`/checkin-config`, checkinConfig);
}
export async function patchCheckinConfigById(id: string, config: PatchCheckinConfigDto): Promise<AxiosResponse<CheckinConfig>> {
  return axiosInstance.patch<CheckinConfig>(`/checkin-config/${id}`, config);
}

export async function deleteCheckinConfigById(id: string): Promise<AxiosResponse<void>> {
  return axiosInstance.delete<void>(`/checkin-config/${id}`);
}
