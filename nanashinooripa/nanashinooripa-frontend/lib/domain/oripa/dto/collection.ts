import { dto } from '@common-utils';
import { Collection } from "../types/collection";

export interface GetCollectionsQueryDto extends dto.GetListQueryDto {
  categoryId?: string;
  pickup?: number;
  status?: string;
}

export type PostCollectionDto = Omit<Collection, 'id'>;
export type PatchCollectionDto = Partial<PostCollectionDto>

export interface CollectionCardCount {
  collectionId: string
  cnt: number
  processed: number
}
