import { createAsyncThunk } from "@reduxjs/toolkit";
import { CardListOptionsDto } from "../dto/card";
import { CardToOripa } from "../types/card-to-oripa";
import { deleteCardToOripaById, getCardToOripaByCollection, getCollectionInitializeStatus, patchCardToOripaById, postCardToOripaDto, postRandomlizeCollection, postResetInventory } from "../api/card-to-oripa.api";
import { CollectionCardCount, PatchCardToOripaDto, PostCardToOripaDto } from "../dto/card-to-oripa";
import { Collection } from "../types/collection";
import { types } from "@common-utils";


export const fetchCardToOripaByCollection = createAsyncThunk<types.Paginated<CardToOripa>, {collectionId: string, cardListDto?: CardListOptionsDto}>(
  'oripa/fetch-card-to-oripa-by-collection',
  async ({collectionId, cardListDto} : {collectionId: string, cardListDto?: CardListOptionsDto}): Promise<types.Paginated<CardToOripa>> => {
    return await getCardToOripaByCollection(collectionId, cardListDto);
  }
);

export const createCardToOripa = createAsyncThunk<CardToOripa, {cardId: string, collectionId: string, createCardToOripaDto: PostCardToOripaDto}>(
  'oripa/create-card-to-oripa',
  async ({ cardId, collectionId, createCardToOripaDto }: {cardId: string, collectionId: string, createCardToOripaDto: PostCardToOripaDto}) => {
    return await postCardToOripaDto(cardId, collectionId, createCardToOripaDto);
  }
);

export const removeCardToOripaById = createAsyncThunk<void, string>(
  'oripa/remove-card-to-oripa-by-id',
  async (id: string)  => {
    return await deleteCardToOripaById(id);
  }
);
export const updateCardToOripaById = createAsyncThunk<CardToOripa, {id: string,  patchCardToOripaDto: PatchCardToOripaDto}>(
  'oripa/update-card-to-oripa-by-id',
  async ({ id, patchCardToOripaDto }: {id: string, patchCardToOripaDto: PatchCardToOripaDto}) => {
    return await patchCardToOripaById(id, patchCardToOripaDto);
  }
);


export const prepareCreateCardToOripa = createAsyncThunk<void, void>(
  'oripa/prepare-create-card-to-oripa',
  async () => {
  }
)

export const prepareRemoveCardToOripa = createAsyncThunk<CardToOripa, CardToOripa>(
  'oripa/prepare-remove-card-to-oripa',
  async (cardToOripa: CardToOripa) => {
    return cardToOripa;
  }
)

export const prepareUpdateCardToOripa = createAsyncThunk<CardToOripa, CardToOripa>(
  'oripa/prepare-update-card-to-oripa',
  async (cardToOripa: CardToOripa) => {
    return cardToOripa;
  }
)


export const prepareRandomlizeCollection = createAsyncThunk<Collection, Collection>(
  'oripa/prepare-randomlize-collection',
  async (collection: Collection) => {
    return collection;
  }
)

export const prepareResetInventory = createAsyncThunk<Collection, Collection>(  
  'oripa/prepare-reset-inventory',
  async (collection: Collection) => {
    return collection;
  }
)

export const randomlizeCollection = createAsyncThunk<void, string>(
  'oripa/randomlize-collection',
  async (collectionId: string) => {
    await postRandomlizeCollection(collectionId);
  }
)

export const clearRandomlizeCollection = createAsyncThunk<void, void>(
  'oripa/clear-randomlize-collection',
  async () => {}
)

export const resetInventory = createAsyncThunk<void, string>(
  'oripa/reset-inventory',
  async (collectionId: string) => {
    await postResetInventory(collectionId);
  }
);

export const clearResetInventory = createAsyncThunk<void, void>(
  'oripa/clear-reset-inventory',
  async () => {}
)

export const fetchCollectionInitializeStatus = createAsyncThunk<CollectionCardCount[], string[]>(
  'oripa/fetch-collection-initialize-status',
  async (idList: string[]) => {
    return await getCollectionInitializeStatus(idList);
  }
);