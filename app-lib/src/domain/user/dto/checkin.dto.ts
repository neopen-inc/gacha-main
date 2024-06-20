import { CheckinConfig } from "../types/checkin.type";

export type PostCheckinConfigDto = Omit<CheckinConfig, 'id'>;
export type PatchCheckinConfigDto = Partial<PostCheckinConfigDto>;
