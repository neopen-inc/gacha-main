import { createAsyncThunk } from "@reduxjs/toolkit";
import { Gacha } from "../types/gacha";
import { PostGachaDto } from "../dto/gacha";
import { getUserGachaHistory, postGacha } from "../api/gacha.api";

export const createGacha = createAsyncThunk<Gacha, PostGachaDto>(
  'card/create-gacha-once',
  async (gachaDto: PostGachaDto) => {
    return await postGacha(gachaDto);
  }
);

export const fetchUserGachaHistory = createAsyncThunk<Gacha[], string>(
  'card/get-user-gacha-history',
  async (userId: string): Promise<Gacha[]> => {
    return getUserGachaHistory(userId);
  }
);
