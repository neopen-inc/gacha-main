
import { Card } from "../types/card";
import { CardListOptionsDto, PatchCardDto, PostCardDto } from "../dto/card";
import { types } from "@common-utils";
import { axiosInstance } from "@loopgacha-app/util/axios";

export async function getCards(cardListDto: CardListOptionsDto): Promise<types.Paginated<Card>> {
  return await axiosInstance
    .get<types.Paginated<Card>>('/cards', {
      params: cardListDto,
    })
    .then((res) => res.data)
}

export async function getCardById(id: string): Promise<Card> {
  return await axiosInstance.get<Card>(`/cards/${id}`).then((res) => res.data);
}

export async function postCard(card: PostCardDto): Promise<Card> {
  return await axiosInstance.post<Card>('/cards', card).then((res) => res.data);
}

export async function patchCardById(id: string, card: PatchCardDto): Promise<Card> {
  return await axiosInstance.patch<Card>(`/cards/${id}`, card).then((res) => res.data);
}

export async function deleteCardById(id: string): Promise<void> {
  return await axiosInstance.delete<void>(`/cards/${id}`).then((res) => res.data);
}
