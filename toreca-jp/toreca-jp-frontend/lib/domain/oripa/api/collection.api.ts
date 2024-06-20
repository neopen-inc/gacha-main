import { axiosInstance } from "@toreca-jp-app/util/axios";
import { Collection } from "../types/collection";
import { GetCollectionsQueryDto, PatchCollectionDto, PostCollectionDto } from "../dto/collection";
import { CollectionProgress } from "../types/collection-progress";
import { types } from "@common-utils";

export async function postCollection(createCollectionDto: PostCollectionDto): Promise<Collection> {
  return await axiosInstance.post<Collection>('/collections', createCollectionDto).then((res) => res.data);
}

export async function getCollections(options: GetCollectionsQueryDto): Promise<types.Paginated<Collection>> {
  return await axiosInstance.get<types.Paginated<Collection>>('/collections', { params: options }).then((res) => res.data);
}

export async function getCollectionById(id: string): Promise<Collection> {
  return await axiosInstance.get<Collection>(`/collections/${id}`).then((res) => res.data);
}

export async function patchCollectionById(id: string, collection: PatchCollectionDto): Promise<Collection> {
  return await axiosInstance.patch<Collection>(`/collections/${id}`, collection).then((res) => res.data);
}

export async function deleteCollectionById(id: string): Promise<void> {
  return await axiosInstance.delete<void>(`/collections/${id}`).then((res) => res.data);
}

export async function getCollectionProgress(idList: string): Promise<CollectionProgress[]> {
  return await axiosInstance
    .get<CollectionProgress[]>(`/cards/collections/progress`, { params: { idList } })
    .then((res) => res.data)
}