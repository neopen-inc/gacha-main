import { Category } from "../types/category";
import { PatchCategoryDto, PostCategoryDto } from "../dto/category";
import { dto, types } from '@common-utils';
import { axiosInstance } from "@loopgacha-app/util/axios";

export async function getCategories(options?: dto.GetListQueryDto): Promise<types.Paginated<Category>> {
  return await axiosInstance.get<types.Paginated<Category>>('/categories', { params: options || {} }).then((res) => res.data);
}

export async function getCategoryById(id: string): Promise<Category> {
  return await axiosInstance.get<Category>(`/categories/${id}`).then((res) => res.data);
}

export async function postCategory(category: PostCategoryDto): Promise<Category> {
  return await axiosInstance.post<Category>('/categories', category).then((res) => res.data);
}

export async function patchCategoryById(id: string, category: PatchCategoryDto): Promise<Category> {
  return await axiosInstance.patch<Category>(`/categories/${id}`, category).then((res) => res.data);
}

export async function deleteCategoryById(id: string): Promise<void> {
  return await axiosInstance.delete<void>(`/categories/${id}`).then((res) => res.data);
}
