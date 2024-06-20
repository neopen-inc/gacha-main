import { createAsyncThunk } from "@reduxjs/toolkit";
import { Card } from "../types/card";
import { CardListOptionsDto, PostCardDto } from "../dto/card";
import { deleteCardById, getCardById, getCards, patchCardById, postCard } from "../api/card.api";
import { types } from "@common-utils";


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
  async () => {
  }
)

export const prepareUpdateCard = createAsyncThunk<Card, Card>(
  'card/prepare-update-card',
  async (card: Card) => {
    return card;
  }
)


export const prepareRemoveCard = createAsyncThunk<Card, Card>(
  'card/prepare-remove-card',
  async (card: Card) => {
    return card;
  }
)


type OperationType = 'gacha' | 'upload' | 'createCategory'
  | 'createCollection' | 'createCard' | 'updateCategory' | 'updateCollection'
  | 'updateCard' | 'deleteCategory' | 'deleteCollection' | 'deleteCard'
  | 'createScene' | 'deleteScene';
