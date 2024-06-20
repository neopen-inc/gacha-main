import { createAsyncThunk } from "@reduxjs/toolkit";
import { Card,Collection  } from "../types";
import { CardListOptionsDto, CollectionCardCount, PostCardDto } from "../dto";
import { deleteCardById, getCardById, getCards, getCollectionInitializeStatus, patchCardById, postCard, postRandomlizeCollection, postResetInventory } from "../api";
import { types } from "@common-utils";


export const prepareRandomlizeCollection = createAsyncThunk<Collection, Collection>(
  'oripa/prepare-randomlize-collection',
  async (collection: Collection) => {
    return collection;
  }
)

export const clearRandomlizeCollection = createAsyncThunk<void, void>(
  'oripa/cancel-randomilize-collection',
  async () => {
    return ;
  }
)

export const prepareResetInventory = createAsyncThunk<Collection, Collection>(  
  'oripa/prepare-reset-inventory',
  async (collection: Collection) => {
    return collection;
  }
)

export const clearResetInventory = createAsyncThunk<void, void>(
  'oripa/cancel-reset-inventory',
  async () => {
    return ;
  }
)

export const randomlizeCollection = createAsyncThunk<void, string>(
  'oripa/randomlize-collection',
  async (collectionId: string) => {
    await postRandomlizeCollection(collectionId);
  }
)

export const resetInventory = createAsyncThunk<void, string>(
  'oripa/reset-inventory',
  async (collectionId: string) => {
    await postResetInventory(collectionId);
  }
);

export const fetchCollectionInitializeStatus = createAsyncThunk<CollectionCardCount[], string[]>(
  'oripa/fetch-collection-initialize-status',
  async (idList: string[]) => {
    return await getCollectionInitializeStatus(idList);
  }
);

export const fetchCards = createAsyncThunk<types.Paginated<Card>, CardListOptionsDto>(
  'oripa/fetch-cards',
  async (cardListDto: CardListOptionsDto): Promise<types.Paginated<Card>> => {
    return await getCards(cardListDto);
  }
);

export const fetchCardById = createAsyncThunk<Card, string>(
  'oripa/fetch-card-by-id',
  async (id: string) => {
    return await getCardById(id);
  }
);

export const removeCardById = createAsyncThunk(
  'oripa/remove-card-by-id',
  async (id: string) => {
    await deleteCardById(id);
  }
);

export const updateCardById = createAsyncThunk<Card, { id: string; card: Partial<Card> }>(
  'card/update-card-by-id',
  async ({ id, card }) => {
    return await patchCardById(id, card);
  }
);

export const createCard = createAsyncThunk<Card, PostCardDto>(
  'card/create-card',
  async (card: PostCardDto) => {
    return await postCard(card);
  }
);

export const prepareCreateCard = createAsyncThunk<void, void>(
  'card/prepare-create-card',
  () => {
    return
  }
)

export const clearCreateCard = createAsyncThunk<void, void>(
  'card/clear-create-card',
  () => {
    return
  }
)

export const prepareUpdateCard = createAsyncThunk<Card, Card>(
  'card/prepare-update-card',
  async (card: Card) => {
    return card;
  }
)

export const clearUpdateCard = createAsyncThunk<void, void>(
  'card/clear-update-card',
  async () => {
    return
  }
)

export const prepareRemoveCard = createAsyncThunk<Card, Card>(
  'card/prepare-remove-card',
  async (card: Card) => {
    return card;
  }
)

export const clearRemoveCard =createAsyncThunk<void, void>(
  'card/clear-remove-card',
  async () => {
    return
  }
)
