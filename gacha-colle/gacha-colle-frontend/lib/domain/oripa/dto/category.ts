import { Category } from "../types/category";

export type PostCategoryDto = Omit<Category, 'id'>;
export type PatchCategoryDto = Partial<PostCategoryDto>;
