import { Category } from "../types/category";

export type PostCategoryDto = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type PatchCategoryDto = Partial<PostCategoryDto>;
