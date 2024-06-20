import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteCheckinConfigById, getCheckinConfigs, patchCheckinConfigById, postCheckinConfig } from "../api/checkin-config.api";
import { postCheckin } from "../api/checkin.api";
import { Checkin, CheckinConfig } from "../types";
import { PatchCheckinConfigDto, PostCheckinConfigDto } from "../dto";

export const checkin = createAsyncThunk<Checkin, string>(
  'user/checkin',
  async (userId: string): Promise<Checkin> => {
    return await postCheckin(userId).then((res) => res.data);
  },
)

export const createCheckinConfig = createAsyncThunk<CheckinConfig, { config: PostCheckinConfigDto }>(
  'user/create-checkin-config',
  async ({ config }: { config: PostCheckinConfigDto }): Promise<CheckinConfig> => {
    return await postCheckinConfig(config).then((res) => res.data);
  },
);

export const confirmCreateCheckinConfig = createAsyncThunk<void, void>(
  'user/confirm-create-checkin-config',
  async (): Promise<void> => {
    return
  }
);

export const confirmUpdateCheckinConfig = createAsyncThunk<CheckinConfig, CheckinConfig>(
  'user/confirm-update-checkin-config',
  async (payload): Promise<CheckinConfig> => {
    return payload
  }
);

export const confirmDeleteCheckinConfig = createAsyncThunk<CheckinConfig, CheckinConfig>(
  'user/confirm-delete-checkin-config',
  async (payload): Promise<CheckinConfig> => {
    return payload
  }
);


export const updateCheckinConfig = createAsyncThunk<CheckinConfig, { id: string, config: PatchCheckinConfigDto }>(
  'user/update-checkin-config',
  async ({ id, config }: { id: string, config: PatchCheckinConfigDto }): Promise<CheckinConfig> => {
    return await patchCheckinConfigById(id, config).then((res) => res.data);
  },
);

export const removeCheckinConfig = createAsyncThunk<void, { id: string }>(
  'user/remove-checkin-config',
  async ({ id }: { id: string }): Promise<void> => {
    await deleteCheckinConfigById(id).then((res) => res.data);
  },
);

export const fetchCheckinConfigs = createAsyncThunk<CheckinConfig[], void>(
  'user/fetch-checkin-configs',
  async (): Promise<CheckinConfig[]> => {
    return await getCheckinConfigs().then((res) => res.data);
  },
);
