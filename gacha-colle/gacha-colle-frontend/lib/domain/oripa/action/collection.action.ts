import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetCollectionsQueryDto, PostCollectionDto } from "../dto/collection";
import { Collection } from "../types/collection";
import { deleteCollectionById, getCollectionById, getCollectionProgress, getCollections, patchCollectionById, postCollection } from "../api/collection.api";
import { CollectionProgress } from "../types/collection-progress";
import { types } from "@common-utils";


export const createCollection = createAsyncThunk<Collection, PostCollectionDto>(
  'oripa/create-collection',
  async (createCollectionDto: PostCollectionDto) => {
    return await postCollection(createCollectionDto);
  }
)

export const fetchCollections = createAsyncThunk<types.Paginated<Collection>, GetCollectionsQueryDto>(
  'oripa/fetch-collections',
  async (options: GetCollectionsQueryDto): Promise<types.Paginated<Collection>> => {
    return await getCollections(options);
  }
);

export const fetchCollectionById = createAsyncThunk<Collection, string>(
  'oripa/fetch-collection-by-id',
  async (id: string): Promise<Collection> => {
    return getCollectionById(id);
  }
);


export const removeCollection = createAsyncThunk(
  'oripa/remove-collection-by-id',
  async (id: string) => {
    deleteCollectionById(id);
  }
)

export const updateCollection = createAsyncThunk<Collection, { id: string; collection: Partial<PostCollectionDto> }>(
  'oripa/update-collection',
  async ({ id, collection }) => {
    return await patchCollectionById(id, collection);
  }
)

export const fetchCollectionProgress = createAsyncThunk<CollectionProgress[], string>(
  'oripa/fetch-collection-progress',
  async (idList: string): Promise<CollectionProgress[]> => {
    return getCollectionProgress(idList)
  },
)


export const prepareCreateCollection = createAsyncThunk<void, void>(
  'oripa/prepare-create-collection',
  async () => {
    return
  }
)

export const prepareUpdateCollection = createAsyncThunk<Collection, Collection>(
  'oripa/prepare-update-collection',
  async (collection: Collection) => {
    return collection;
  }
)

export const prepareRemoveCollection = createAsyncThunk<Collection, Collection>(
  'oripa/prepare-remove-collection',
  async (collection: Collection) => {
    return collection;
  }
)

export const clearCreateCollection = createAsyncThunk<void, void>(
  'oripa/clear-create-collection',
  async () => {
    return
  }
)

export const clearUpdateCollection = createAsyncThunk<void, void>(
  'oripa/clear-update-collection',
  async () => {
    return
  }
)

export const clearRemoveCollection = createAsyncThunk<void, void>(
  'oripa/clear-remove-collection',
  async () => {
    return
  }
)