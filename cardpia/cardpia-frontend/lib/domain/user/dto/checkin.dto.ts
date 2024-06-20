import { CheckinConfig } from "../types";

export type PostCheckinConfigDto = Omit<CheckinConfig, 'id'>;
export type PatchCheckinConfigDto = Partial<PostCheckinConfigDto>;
