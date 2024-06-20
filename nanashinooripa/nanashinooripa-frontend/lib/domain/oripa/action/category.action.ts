import { createAsyncThunk } from "@reduxjs/toolkit";
import { Category } from "../types/category";
import { PatchCategoryDto, PostCategoryDto } from "../dto/category";
import { deleteCategoryById, getCategories, getCategoryById, patchCategoryById, postCategory } from "../api/category.api";
import { dto, types } from '@common-utils';

export const createCategory = createAsyncThunk<Category, PostCategoryDto>(
  'oripa/create-category',
  async (createCategoryDto: PostCategoryDto): Promise<Category> => {
    return postCategory(createCategoryDto);
  }
)

export const fetchCategories = createAsyncThunk<types.Paginated<Category>, dto.GetListQueryDto>(
  'oripa/fetch-categories',
  async (options?: dto.GetListQueryDto): Promise<types.Paginated<Category>> => {
    return await getCategories(options);
  }
);

export const fetchCategoryById = createAsyncThunk<Category, string>(
  'oripa/fetch-category-by-id',
  async (id: string) => {
    return await getCategoryById(id);
  }
);

export const removeCategoryById = createAsyncThunk(
  'oripa/remove-category-by-id',
  async (id: string) => {
    await deleteCategoryById(id);
  }
)

export const updateCategoryById = createAsyncThunk<Category, { id: string; category: PatchCategoryDto }>(
  'oripa/update-category-by-id',
  async ({ id, category }) => {
    return patchCategoryById(id, category);
  }
)


export const prepareUpdateCategory = createAsyncThunk<Category, Category>(
  'card/prepare-update-category',
  async (category: Category) => {
    return category;
  }
)

export const clearUpdateCategory = createAsyncThunk<void, void>(
  'card/clear-update-category',
  async () => {
    return
  }
)


export const prepareCreateCategory = createAsyncThunk<void, void>(
  'card/prepare-create-category',
  async () => {
    return
  }
)

export const clearCreateCategory = createAsyncThunk<void, void>(
  'card/clear-create-category',
  async () => {
    return
  }
)

export const prepareRemoveCategory = createAsyncThunk<Category, Category>(
  'card/prepare-remove-category',
  async (category: Category) => {
    return category;
  }
)

export const clearRemoveCategory = createAsyncThunk<void, void>(
  'card/clear-remove-category',
  async () => {
    return ;
  }
)
