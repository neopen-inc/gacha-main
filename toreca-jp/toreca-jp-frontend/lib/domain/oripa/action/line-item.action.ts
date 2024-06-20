import { createAsyncThunk } from "@reduxjs/toolkit";
import { LineItem } from "../types/line-item";
import { getUserLineItems } from "../api/line-item.api";
import { types } from "@common-utils";


export const fetchUserLineItems = createAsyncThunk<types.Paginated<LineItem>, string>(
  'card/fetch-user-line-items',
  async (userId: string): Promise<types.Paginated<LineItem>> => {
    return await getUserLineItems(userId);
  }
);
