import { axiosInstance } from "@gacha-labs-app/util/axios";
import { PointPackage } from "../types/point-package.type";
import { dto } from '@common-utils';
import { PatchPointPackageDto, PostPointPackageDto } from "../dto/point-package.dto";

export async function getPointPackages(options: dto.GetListQueryDto): Promise<PointPackage[]> {
  return await axiosInstance.get<PointPackage[]>('/point-packages', { params: options }).then((res) => res.data);
}

export async function getPointPackageById(id: string): Promise<PointPackage> {
  return await axiosInstance.get<PointPackage>(`/point-packages/${id}`).then((res) => res.data);
}

export async function postPointPackage(pointPackage: PostPointPackageDto): Promise<PointPackage> {
  return await axiosInstance.post<PointPackage>('/point-packages', pointPackage).then((res) => res.data);
}

export async function deletePointPackateById(id: string): Promise<void> {
  await axiosInstance.delete<void>(`/point-packages/${id}`);
}

export async function patchPointPackageById(id: string, updatePointPackageDto: PatchPointPackageDto): Promise<PointPackage> {
  return await axiosInstance.patch<PointPackage>(`/point-packages/${id}`, updatePointPackageDto).then((res) => res.data);
}
