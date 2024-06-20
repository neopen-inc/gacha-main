import { PointPackage } from "../types/point-package.type";

export type PostPointPackageDto = Omit<PointPackage, 'id'>
export type PatchPointPackageDto = Partial<PostPointPackageDto>
