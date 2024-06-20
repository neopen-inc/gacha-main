import { dto } from '@common-utils';
import { Card } from "../types/card";
import { CardToOripa } from "../types/card-to-oripa";

export interface CardToOripaListOptionsDto extends dto.GetListQueryDto {
  collectionId?: string
  categoryId?: string
  grade?: string;
}

export type PostCardToOripaDto = Omit<CardToOripa, 'id' | 'cardId' | 'collectionId' | 'card'>
export type PatchCardToOripaDto = Partial<PostCardToOripaDto>


export interface CollectionCardCount {
  collectionId: string
  cnt: number
  processed: number
}
