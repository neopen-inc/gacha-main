import { Collection } from "../types/collection";
import { types } from "@common-utils";
import { CollectionCardCount, GetCollectionsQueryDto, PatchCollectionDto, PostCollectionDto } from "../dto/collection";
import { CollectionProgress } from "../types/collection-progress";
import { axiosInstance } from "@gacha-colle-app/util/axios";

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


export async function postResetInventory(collectionId: string) {
  return await axiosInstance.post<void>(`/cards/collections/${collectionId}/reset`);
}

export async function postRandomlizeCollection(collectionId: string) {
  return await axiosInstance.post<void>(`/cards/collections/${collectionId}/randomlize`);
}

export async function getCollectionInitializeStatus(idList: string[]): Promise<CollectionCardCount[]> {
  return await axiosInstance.get<CollectionCardCount[]>(`/cards/collections/generate-status/multiple`, { params: { idList: idList.join(',') } }).then((res) => res.data);
}
