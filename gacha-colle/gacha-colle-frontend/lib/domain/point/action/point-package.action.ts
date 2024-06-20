import { createAsyncThunk } from "@reduxjs/toolkit"
import { PatchPointPackageDto, PostPointPackageDto } from "../dto/point-package.dto"
import { PointPackage } from "../types/point-package.type"
import { deletePointPackateById, getPointPackageById, getPointPackages, patchPointPackageById, postPointPackage } from "../api/point-package.api"
import { dto } from "@common-utils";

export const createPointPackage = createAsyncThunk<
  PointPackage, PostPointPackageDto>('point/create-point-package', async (postPointPackageDto: PostPointPackageDto) => {
  const pointPackage = await postPointPackage(postPointPackageDto)
  return pointPackage
})

export const fetchPointPackages = createAsyncThunk<
  PointPackage[],
  dto.GetListQueryDto
>('point/get-point-packages', async (options: dto.GetListQueryDto) => {
  const pointPackages = await getPointPackages(options)
  return pointPackages
})

export const fetchPointPackageById = createAsyncThunk<
  PointPackage,
  string
>('point/get-point-package', async (id: string) => {
  const pointPackage = await getPointPackageById(id)
  return pointPackage
})

export const removePointPackage = createAsyncThunk<
  void,
  string
>('point/remove-point-package', async (id: string) => {
  await deletePointPackateById(id)
})

export const updatePointPackage = createAsyncThunk<
  void,
  { id: string; patchPointPackageDto: PatchPointPackageDto }
>('point/update-point-package', async ({ id, patchPointPackageDto }) => {
  await patchPointPackageById(id, patchPointPackageDto)
})

export const prepareCreatePointPackage = createAsyncThunk<void, void>('point/prepare-create-package', async () => {
  return;
})

export const prepareUpdatePointPackage = createAsyncThunk<PointPackage, PointPackage>('point/prepare-update-package', async (pointPackage: PointPackage) => {
  return pointPackage;
})

export const prepareRemovePointPackage = createAsyncThunk<PointPackage, PointPackage>('point/prepare-remove-package', async (pointPackage: PointPackage) => {
  return pointPackage;
})

export const clearCreatePointPackage = createAsyncThunk<void, void>('point/clear-create-package', async () => {
  return;
})

export const clearUpdatePointPackage = createAsyncThunk<void, void>('point/clear-update-package', async () => {
  return;
})

export const clearRemovePointPackage = createAsyncThunk<void, void>('point/clear-remove-package', async () => {
  return;
})
