
import { Scene } from "../types/scene";

export type PostSceneDto = Pick<Scene, 'grade' | 'url'>;
export type PatchSceneDto = Partial<PostSceneDto>;
