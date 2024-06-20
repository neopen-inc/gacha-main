import { axiosInstance } from "@gacha-land-app/util/axios";
import { Gacha } from "../types/gacha";
import { PostGachaDto } from "../dto/gacha";

export async function postGacha(gacha: PostGachaDto): Promise<Gacha> {
  return await axiosInstance.post<Gacha>('/gacha', gacha).then((res) => res.data).catch((err) => {
    throw new Error(err.response.data.message);
  });
}

export async function getUserGachaHistory(userId: string): Promise<Gacha[]> {
  return await axiosInstance.get<Gacha[]>(`/users/${userId}/gacha`).then((res) => res.data);
}
