import { axiosInstance } from "@gacha-colle-app/util/axios";
import { Scene } from "../types/scene";
import { PatchSceneDto, PostSceneDto } from "../dto/scene";

export async function postScene(createSceneDto: PostSceneDto): Promise<Scene> {
  return await axiosInstance.post<Scene>('/scenes', createSceneDto).then((res) => res.data);
}

export async function patchSceneById(id: string, scene: Partial<PatchSceneDto>): Promise<Scene> {
  return await axiosInstance.patch<Scene>(`/scenes/${id}`, scene).then((res) => res.data);
}

export async function getScenes(): Promise<Scene[]> {
  return await axiosInstance.get<Scene[]>('/scenes').then((res) => res.data);
}

export async function getSceneByGrade(grade: string): Promise<Scene> {
  return await axiosInstance.get<Scene>(`/scenes/${grade}`).then((res) => res.data);
}

export async function deleteSceneById(id: string) {
  return await axiosInstance.delete<void>(`/scenes/${id}`);
}

