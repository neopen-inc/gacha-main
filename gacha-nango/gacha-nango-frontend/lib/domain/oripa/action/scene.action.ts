import { createAsyncThunk } from "@reduxjs/toolkit";
import { Scene } from "../types/scene";
import { PatchSceneDto, PostSceneDto } from "../dto/scene";
import { deleteSceneById, getSceneByGrade, getScenes, patchSceneById, postScene } from "../api/scene.api";


export const createScene = createAsyncThunk<Scene, PostSceneDto>(
  'oripa/create-scene',
  async (scene: PostSceneDto) => {
    return await postScene(scene);
  }
)

export const updateScene = createAsyncThunk<Scene, { id: string; scene: Partial<PatchSceneDto> }>(
  'oripa/update-scene',
  async ({ id, scene }) => {
    return await patchSceneById(id, scene);
  }
);

export const removeScene = createAsyncThunk<void, string>(
  'oripa/remove-scene',
  async (id: string) => {
    await deleteSceneById(id);
  }
);

export const fetchScenes = createAsyncThunk<Scene[], void>(
  'oripa/fetch-scenes',
  async () => {
    return await getScenes();
  }
);

export const fetchSceneByGrade = createAsyncThunk<Scene, string>(
  'oripa/fetch-scene-by-grade',
  async (grade: string) => {
    return await getSceneByGrade(grade);
  }
);

export const prepareCreateScene = createAsyncThunk<void, void>(
  'oripa/prepare-create-scene',
  async () => {
    return
  }
)

export const prepareUpdateScene = createAsyncThunk<Scene, Scene>(
  'oripa/prepare-update-scene',
  async (scene: Scene) => {
    return scene;
  }
);

export const prepareRemoveScene = createAsyncThunk<Scene, Scene>(
  'oripa/prepare-remove-scene',
  async (scene: Scene) => {
    return scene;
  }
)

export const clearCreateScene = createAsyncThunk<void, void>(
  'oripa/clear-create-scene',
  async () => {
    return
  }
)

export const clearUpdateScene = createAsyncThunk<void, void>(
  'oripa/clear-update-scene',
  async () => {
    return
  }
)

export const clearRemoveScene = createAsyncThunk<void, void>(
  'oripa/clear-remove-scene',
  async () => {
    return
  }
)
