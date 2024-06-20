import { dto } from '@common-utils';
import { Card } from "../types/card";

export interface CardListOptionsDto extends dto.GetListQueryDto {
  collectionId?: string
  categoryId?: string
  grade?: string;
  pickup?: number;
}

export type PostCardDto = Omit<Card, 'id' | 'category'>
export type PatchCardDto = Partial<Card>
