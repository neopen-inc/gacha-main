import { axiosInstance } from "@toreca-jp-app/util/axios";
import { CardListOptionsDto } from "../dto/card";
import { CollectionCardCount, PatchCardToOripaDto, PostCardToOripaDto } from "../dto/card-to-oripa";
import { CardToOripa } from "../types/card-to-oripa";
import { types } from "@common-utils";

export async function getCardToOripaByCollection(collectionId: string, cardListDto?: CardListOptionsDto): Promise<types.Paginated<CardToOripa>> {
  return await axiosInstance
    .get<types.Paginated<CardToOripa>>(`/cards/collection/${collectionId}`, {
      params: cardListDto || {},
    })
    .then((res) => res.data)
}


export async function postCardToOripaDto(cardId: string, collectionId: string, createCardToOripaDto: PostCardToOripaDto): Promise<CardToOripa> {
  return await axiosInstance.post<CardToOripa>(`/cards/${cardId}/collection/${collectionId}/associate`, createCardToOripaDto).then((res) => res.data);
}


export async function patchCardToOripaById(id: string, card: PatchCardToOripaDto): Promise<CardToOripa> {
  return await axiosInstance.patch<CardToOripa>(`/cards/card-to-oripa/${id}`, card).then((res) => res.data);
}

export async function deleteCardToOripaById(id: string): Promise<void> {
  return await axiosInstance.delete<void>(`/cards/card-to-oripa/${id}`).then((res) => res.data);
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
