import { dto } from '@common-utils';
import { Collection } from "../types/collection";

export interface GetCollectionsQueryDto extends dto.GetListQueryDto {
  categoryId?: string;
}

export type PostCollectionDto = Omit<Collection, 'id'>;
export type PatchCollectionDto = Partial<PostCollectionDto>
