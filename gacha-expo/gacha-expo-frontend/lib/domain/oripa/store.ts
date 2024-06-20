import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { clearCreateCategory, clearRemoveCategory, clearUpdateCategory, createCategory, fetchCategories, fetchCategoryById, prepareCreateCategory, prepareRemoveCategory, prepareUpdateCategory, removeCategoryById, updateCategoryById } from "./action/category.action";
import { clearCreateCollection, clearRemoveCollection, clearUpdateCollection, createCollection, fetchCollectionById, fetchCollectionProgress, fetchCollections, prepareCreateCollection, prepareRemoveCollection, prepareUpdateCollection, removeCollection, updateCollection } from "./action/collection.action";
import { Category } from "./types/category";
import { types } from "@common-utils";
import { Collection } from "./types/collection";
import { Scene } from "./types/scene";
import { clearCreateScene, clearRemoveScene, clearUpdateScene, createScene, fetchSceneByGrade, fetchScenes, prepareCreateScene, prepareRemoveScene, prepareUpdateScene, removeScene, updateScene } from "./action/scene.action";
import { Card } from "./types/card";
import { clearCreateCard, clearRandomlizeCollection, clearRemoveCard, clearResetInventory, clearUpdateCard, createCard, fetchCardById, fetchCards, prepareCreateCard, prepareRemoveCard, prepareUpdateCard, removeCardById, updateCardById } from "./action/card.action";
import { CollectionProgress } from "./types/collection-progress";
import { LineItem } from "./types/line-item";
import { Gacha } from "./types/gacha";
import { createGacha, fetchUserGachaHistory } from "./action/gacha.action";
import { clearReturnItem, fetchUserLineItems, prepareReturnItem, returnItem, returnMany, waitForShipGroups } from "./action/line-item.action";
import { Shipping } from "../shipping/types/shipping.type";
import { WaitingForShip } from "./dto/line-item";
import { PostShippingDto } from "../shipping/dto/shipping.dto";
import { fetchCollectionInitializeStatus, prepareRandomlizeCollection, prepareResetInventory, randomlizeCollection, resetInventory } from "./action/card.action";
import { CollectionCardCount } from "./dto/collection";


type OperationType = 'createCategory'
  | 'createCollection' | 'createCard' | 'updateCategory' | 'updateCollection'
  | 'updateCard' | 'removeCategory' | 'removeCollection' | 'removeCard' | 'returnItem'
  | 'createScene' | 'removeScene' | 'createCardToOripa' | 'randomlizeCollection' |  'resetCollection' | 'fetchCollectionInitializeStatus'
  | 'removeCardToOripaById' | 'updateCardToOripaById';

export interface OripaState {
  category: {
    category: Category | undefined;
    categories: types.Paginated<Category>;
    editMode: string;
  }
  collection: {
    collection: Collection | undefined;
    collections: types.Paginated<Collection>;
    editMode: string;
    collectionProgress: CollectionProgress[]
  }
  card: {
    card: Card | undefined;
    cards: types.Paginated<Card>;
    editMode: string;
  }
  gacha: {
    result?: Gacha;
    history: Gacha[];
  }
  lineItem: {
    lineItems: types.Paginated<LineItem>;
  }
  scene: {
    scenes: Scene[];
    scene: Scene | undefined;
  }
  myLineItems: {
    unselected: types.Paginated<LineItem>,
    returned: types.Paginated<LineItem>,
    waiting_for_ship: types.Paginated<LineItem>,
    shipped: types.Paginated<LineItem>,
    all: types.Paginated<LineItem>,
  },
  returnResult: {
    points: number,
  },
  waitForShipGroups: WaitingForShip[],
  shipping: Shipping | undefined,
  shippings: types.Paginated<Shipping>,

  operations: {
    createCategory: types.Operation<Category>,
    updateCategory: types.Operation<Category>,
    removeCategory: types.Operation<Category>,
    fetchCategories: types.Operation<types.Paginated<Category>>,
    fetchCategoryById: types.Operation<Category>,

    removeCollection: types.Operation<Collection>,
    createCollection: types.Operation<Collection>,
    updateCollection: types.Operation<Collection>,
    fetchCollections: types.Operation<types.Paginated<Collection>>,
    fetchCollectionById: types.Operation<Collection>,
    fetchCollectionProgress: types.Operation<CollectionProgress[]>,
    
    createCard: types.Operation<Card>,
    updateCard: types.Operation<Card>,
    removeCard: types.Operation<Card>,
    fetchCards: types.Operation<types.Paginated<Card>>,
    fetchCardById: types.Operation<Card>,
    
    createScene: types.Operation<Scene>,
    removeScene: types.Operation<Scene>,
    updateScene: types.Operation<Scene>,
    fetchScenes: types.Operation<Scene[]>,
    fetchSceneByGrade: types.Operation<Scene>,
    
    returnItem: types.Operation<Omit<PostShippingDto, 'addressId'>>
    createShipping: types.Operation<Shipping>,
    updateShipping: types.Operation<Shipping>,

    
    randomlizeCollection: types.Operation<Collection>,
    resetCollection: types.Operation<Collection>,
    fetchCollectionInitializeStatus: types.Operation<CollectionCardCount[]>,
  }
}

/*


    upload: types.Operation<{ url: string }>,
    gacha: types.Operation<Gacha>,*/

export const clearOperationStatus = createAsyncThunk<OperationType, OperationType>(
  'card/clear-operation-status',
  async (operation: OperationType) => {
    return operation
  }
);
const initialState: OripaState = {
  category: {
    category: undefined,
    categories: {
      total: 0,
      count: 0,
      offset: 0,
      limit: 0,
      data: [],
    },
    editMode: 'create',
  },
  scene: {
    scenes: [],
    scene: undefined,
  },
  collection: {
    collection: undefined,
    collections: {
      total: 0,
      count: 0,
      offset: 0,
      limit: 0,
      data: [],
    },
    editMode: 'create',
    collectionProgress: [],
  },
  myLineItems: {
    unselected: {
      total: 0,
      count: 0,
      offset: 0,
      limit: 0,
      data: [],
    },
    returned: {
      total: 0,
      count: 0,
      offset: 0,
      limit: 0,
      data: [],
    },
    waiting_for_ship: {
      total: 0,
      count: 0,
      offset: 0,
      limit: 0,
      data: [],
    },
    shipped: {
      total: 0,
      count: 0,
      offset: 0,
      limit: 0,
      data: [],
    },
    all: {
      total: 0,
      count: 0,
      offset: 0,
      limit: 0,
      data: [],
    },
  },
  returnResult: {
    points: 0,
  },
  waitForShipGroups: [],
  shipping: undefined,
  shippings: {
    total: 0,
    count: 0,
    offset: 0,
    limit: 0,
    data: [],
  },
  operations: {
    fetchCollectionProgress: {
      status: 'idle'
    },
    fetchCategories: {
      status: 'idle',
    },
    fetchCollections: {
      status: 'idle',
    },
    fetchCards: {
      status: 'idle',
    },
    fetchCategoryById: {
      status: 'idle'
    },
    fetchCollectionById: {
      status: 'idle'
    },
    fetchCardById: {
      status: 'idle'
    },
    fetchScenes: {
      status: 'idle',
    },
    fetchSceneByGrade: {
      status: 'idle',
    },
    createCategory: {
      status: 'idle',
    },
    createCollection: {
      status: 'idle',
    },
    createCard: {
      status: 'idle',
    },
    updateCategory: {
      status: 'idle',
    },
    updateCollection: {
      status: 'idle',
    },
    updateCard: {
      status: 'idle',
    },
    removeCategory: {
      status: 'idle',
    },
    removeCollection: {
      status: 'idle',
    },
    removeCard: {
      status: 'idle',
    },
    createScene: {
      status: 'idle',
    },
    updateScene: {
      status: 'idle',
    },
    removeScene: {
      status: 'idle',
    },
    updateShipping: {
      status: 'idle'
    },
    createShipping: {
      status: 'idle'
    },
    returnItem: {
      status: 'idle'
    },
    randomlizeCollection: {
      status: 'idle'
    },
    resetCollection: {
      status: 'idle'
    },
    fetchCollectionInitializeStatus: {
      status: 'idle'
    },
  },
  card: {
    card: undefined,
    cards: {
      total: 0,
      count: 0,
      offset: 0,
      limit: 0,
      data: [],
    },
    editMode: 'create',
  },
  gacha: {
    result: undefined,
    history: [],
  },
  lineItem: {
    lineItems: {
      total: 0,
      count: 0,
      offset: 0,
      limit: 0,
      data: [],
    }
  }
}


export const oripaSlice = createSlice({
  name: 'oripa',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // create category
    builder.addCase(createCategory.fulfilled, (state, { payload }) => {
      state.category.category = payload;
      state.operations.createCategory = {
        status: 'succeeded',
        message: `カテゴリー${payload.name}作成に成功しました`,
      }
    }).addCase(createCategory.rejected, (state, { error }) => {
      state.operations.createCategory = {
        status: 'failed',
        message: `カテゴリー作成に失敗しました`,
      }
    }).addCase(createCategory.pending, (state) => {
      state.operations.createCategory = {
        status: 'busy',
      }
    }).addCase(prepareCreateCategory.fulfilled, (state) => {
      state.operations.createCategory = {
        status: 'confirm',
      }
    }).addCase(clearCreateCategory.fulfilled, (state) => {
      state.operations.createCategory = {
        status: 'idle'
      }
    });

    // remove category
    builder.addCase(removeCategoryById.fulfilled, (state, { payload }) => {
      state.category.category = undefined;
      state.operations.removeCategory = {
        status: 'succeeded',
        message: `カテゴリー削除に成功しました`,
      }
    }).addCase(removeCategoryById.rejected, (state, { payload }) => {
      state.operations.removeCategory = {
        status: 'failed',
        message: `カテゴリー削除に失敗しました`,
      }
    }).addCase(removeCategoryById.pending, (state) => {
      state.operations.createCategory = {
        status: 'busy',
      }
    }).addCase(prepareRemoveCategory.fulfilled, (state, { payload }) => {
      state.operations.removeCategory = {
        status: 'confirm',
        payload
      }
    }).addCase(clearRemoveCategory.fulfilled, (state) => {
      state.operations.removeCategory = {
        status: 'idle'
      }
    });

    // update category
    builder.addCase(updateCategoryById.fulfilled, (state, { payload }) => {
      state.category.category = payload;
      state.operations.updateCategory = {
        status: 'succeeded',
        payload,
        message: `カテゴリー${payload.name}更新に成功しました`,
      }
    }).addCase(updateCategoryById.rejected, (state, { payload }) => {
      state.operations.updateCategory = {
        status: 'failed',
        message: `カテゴリー更新に失敗しました, ${(payload as any).message}`,
      }
    }).addCase(updateCategoryById.pending, (state) => {
      state.operations.updateCategory = {
        status: 'busy',
      }
    }).addCase(prepareUpdateCategory.fulfilled, (state, { payload }) => {
      state.operations.updateCategory = {
        status: 'confirm',
        payload: payload,
      }
    }).addCase(clearUpdateCategory.fulfilled, (state) => {
      state.operations.updateCategory = {
        status: 'idle'
      }
    });

    // fetch category
    builder.addCase(fetchCategories.fulfilled, (state, { payload }) => {
      state.operations.fetchCategories = {
        status: 'succeeded',
        payload,
        message: `カテゴリー取得に成功しました`,
      }
    }).addCase(fetchCategoryById.fulfilled, (state, { payload }) => {
      state.operations.fetchCategoryById = {
        status: 'succeeded',
        payload,
      }
    }).addCase(fetchCategoryById.rejected, (state, { payload }) => {
      state.operations.fetchCategoryById = {
        status: 'failed',
        message: `カテゴリー取得に失敗しました, ${(payload as any).message}`,
      }
    }).addCase(fetchCategoryById.pending, (state) => {
      state.operations.fetchCategoryById = {
        status: 'busy',
      }
    });

    // create collection
    builder.addCase(createCollection.fulfilled, (state, { payload }) => {
      state.operations.createCollection = {
        status: 'succeeded',
        payload,
        message: `オリパ${payload.name}作成に成功しました`,
      }
    }).addCase(createCollection.rejected, (state, { payload }) => {
      state.operations.createCollection = {
        status: 'failed',
        message: `オリパ作成に失敗しました, ${(payload as any).message}`,
      }
    }).addCase(createCollection.pending, (state) => {
      state.operations.createCollection = {
        status: 'busy',
      }
    }).addCase(prepareCreateCollection.fulfilled, (state) => {
      state.operations.createCollection = {
        status: 'confirm',
      }
    }).addCase(clearCreateCollection.fulfilled, (state) => {
      state.operations.createCollection = {
        status: 'idle'
      }
    });

    // update collection
    builder.addCase(updateCollection.fulfilled, (state, { payload }) => {
      state.collection.collection = payload;
      state.operations.updateCollection = {
        status: 'succeeded',
        payload,
        message: `オリパ更新に成功しました`,
      }
    }).addCase(updateCollection.rejected, (state, { payload }) => {
      state.operations.updateCollection = {
        status: 'failed',
        message: `オリパ更新に失敗しました`,
      }
    }).addCase(updateCollection.pending, (state) => {
      state.operations.updateCollection = {
        status: 'busy',
      }
    }).addCase(prepareUpdateCollection.fulfilled, (state, { payload }) => {
      state.operations.updateCollection = {
        status: 'confirm',
        payload: payload,
      }
    }).addCase(clearUpdateCollection.fulfilled, (state) => {
      state.operations.updateCollection = {
        status: 'idle'
      }
    });


    // remove collection
    builder.addCase(removeCollection.fulfilled, (state, { payload }) => {
      state.operations.removeCollection = {
        status: 'succeeded',
        message: `オリパ削除に成功しました`,
      }
    }).addCase(removeCollection.rejected, (state, { payload }) => {
      state.operations.removeCollection = {
        status: 'failed',
        message: `オリパ削除に失敗しました`,
      }
    }).addCase(removeCollection.pending, (state) => {
      state.operations.removeCollection = {
        status: 'busy',
      };
    }).addCase(prepareRemoveCollection.fulfilled, (state, { payload }) => {
      state.operations.removeCollection = {
        status: 'confirm',
        payload: payload,
      }
    }).addCase(clearRemoveCollection.fulfilled, (state) => {
      state.operations.removeCollection = {
        status: 'idle'
      }
    });

  // fetch collection
  builder.addCase(fetchCollections.fulfilled, (state, { payload }) => {
    state.operations.fetchCollections = {
      status: 'succeeded',
      payload,
      message: `オリパ取得に成功しました`,
    }
  }).addCase(fetchCollectionById.fulfilled, (state, { payload }) => {
    state.operations.fetchCollectionById = {
      status: 'succeeded',
      payload,
    }
  }).addCase(fetchCollectionById.rejected, (state, { payload }) => {
    state.operations.fetchCollectionById = {
      status: 'failed',
      message: `カテゴリー取得に失敗しました, ${(payload as any).message}`,
    }
  }).addCase(fetchCollectionById.pending, (state) => {
    state.operations.fetchCollectionById = {
      status: 'busy',
    }
  });

  // create card
  builder.addCase(createCard.fulfilled, (state, { payload }) => {
    state.operations.createCard = {
      status: 'succeeded',
      payload,
      message: `カード${payload.name}作成に成功しました`,
    }
  }).addCase(createCard.rejected, (state, { payload }) => {
    state.operations.createCard = {
      status: 'failed',
      message: `カード作成に失敗しました`,
    }
  }).addCase(createCard.pending, (state) => {
    state.operations.createCard = {
      status: 'busy',
    }
  }).addCase(prepareCreateCard.fulfilled, (state) => {
    state.operations.createCard = {
      status: 'confirm',
    }
  }).addCase(clearCreateCard.fulfilled, (state) => {
    state.operations.createCard = {
      status: 'idle'
    }
  });
  
  // update card
  builder.addCase(updateCardById.fulfilled, (state, { payload }) => {
    state.operations.updateCard = {
      status: 'succeeded',
      payload,
      message: `カード${payload.name}更新に成功しました`,
    }
  }).addCase(updateCardById.rejected, (state, { payload }) => {
    state.operations.updateCard = {
      status: 'failed',
      message: `カード更新に失敗しました`,
    }
  }).addCase(updateCardById.pending, (state) => {
    state.operations.updateCard = {
      status: 'busy',
    }
  }).addCase(prepareUpdateCard.fulfilled, (state, { payload }) => {
    state.operations.updateCard = {
      status: 'confirm',
      payload: payload,
    }
  }).addCase(clearUpdateCard.fulfilled, (state) => {
    state.operations.updateCard = {
      status: 'idle'
    }
  });

  // remove card
  builder.addCase(removeCardById.fulfilled, (state, { payload }) => {
    state.operations.removeCard = {
      status: 'succeeded',
      message: `カード削除に成功しました`,
    }
  }).addCase(removeCardById.rejected, (state, { payload }) => {
    state.operations.removeCard = {
      status: 'failed',
      message: `カード削除に失敗しました`,
    }
  }).addCase(removeCardById.pending, (state) => {
    state.operations.removeCard = {
      status: 'busy',
    }
  }).addCase(prepareRemoveCard.fulfilled, (state, { payload }) => {
    state.operations.removeCard = {
      status: 'confirm',
      payload: payload,
    }
  }).addCase(clearRemoveCard.fulfilled, (state) => {
    state.operations.removeCard = {
      status: 'idle'
    }
  });

  // fetch card
  builder.addCase(fetchCards.fulfilled, (state, { payload }) => {
    state.operations.fetchCards = {
      status: 'succeeded',
      payload,
      message: `カード取得に成功しました`,
    }
  }).addCase(fetchCardById.fulfilled, (state, { payload }) => {
    state.operations.fetchCardById = {
      status: 'succeeded',
      payload,
    }
  }).addCase(fetchCardById.rejected, (state, { payload }) => {
    state.operations.fetchCardById = {
      status: 'failed',
      message: `カテゴリー取得に失敗しました, ${(payload as any).message}`,
    }
  }).addCase(fetchCardById.pending, (state) => {
    state.operations.fetchCardById = {
      status: 'busy',
    }
  });

  // create scene
  builder.addCase(createScene.fulfilled, (state, { payload }) => {
    state.operations.createScene = {
      status: 'succeeded',
      payload,
    }
  }).addCase(createScene.rejected, (state, { payload }) => {
    state.operations.createScene = {
      status: 'failed',
      message: 'シーンの作成に失敗しました。'
    }
  }).addCase(createScene.pending, (state, { payload }) => {
    state.operations.createScene = {
      status: 'busy'
    }
  }).addCase(prepareCreateScene.fulfilled, (state) => {
    state.operations.createScene = {
      status: 'confirm',
    }
  }).addCase(clearCreateScene.fulfilled, (state) => {
    state.operations.createScene = {
      status: 'idle'
    }
  });

  // remove scene
  builder.addCase(removeScene.fulfilled, (state, { payload }) => {
    state.operations.removeScene = {
      status: 'succeeded',
    }
  }).addCase(removeScene.rejected, (state, { payload }) => {
    state.operations.removeScene = {
      status: 'failed',
      message: 'シーンの削除に失敗しました。'
    }
  }).addCase(removeScene.pending, (state, { payload }) => {
    state.operations.removeScene = {
      status: 'busy'
    }
  }).addCase(prepareRemoveScene.fulfilled, (state, { payload }) => {
    state.operations.removeScene = {
      status: 'confirm',
      payload,
    }
  }).addCase(clearRemoveScene.fulfilled, (state) => {
    state.operations.removeScene = {
      status: 'idle'
    }
  });

  // update scene
  builder.addCase(updateScene.fulfilled, (state, { payload }) => {
    state.operations.updateScene = {
      status: 'succeeded',
      payload,
    }
  }).addCase(updateScene.rejected, (state, { payload }) => {
    state.operations.updateScene = {
      status: 'failed',
      message: 'シーンの更新に失敗しました。'
    }
  }).addCase(updateScene.pending, (state, { payload }) => {
    state.operations.updateScene = {
      status: 'busy'
    }
  }).addCase(prepareUpdateScene.fulfilled, (state, { payload }) => {
    state.operations.updateScene = {
      status: 'confirm',
      payload: payload,
    }
  }).addCase(clearUpdateScene.fulfilled, (state) => {
    state.operations.updateScene = {
      status: 'idle'
    }
  });

  builder.addCase(fetchScenes.fulfilled, (state, { payload }) => {
    state.operations.fetchScenes = {
      status: 'succeeded',
      payload,
    };
  });
  
  builder.addCase(fetchSceneByGrade.fulfilled, (state, { payload }) => {
    state.operations.fetchSceneByGrade = {
      status: 'succeeded',
      payload,
    };
  });

  builder
      .addCase(fetchUserLineItems.fulfilled, (state, action) => {
        if (action.payload.status === 'unselected') {
          state.myLineItems.unselected = action.payload.lineItemResult;
        }
        if (action.payload.status === 'returned') {
          state.myLineItems.returned = action.payload.lineItemResult;
        }
        if (action.payload.status === 'waiting_for_ship') {
          state.myLineItems.waiting_for_ship = action.payload.lineItemResult;
        }
        if (action.payload.status === 'shipped') {
          state.myLineItems.shipped = action.payload.lineItemResult;
        }
        if (!action.payload.status) {
          state.myLineItems.all = action.payload.lineItemResult;
        }
      })
      .addCase(returnItem.fulfilled, (state, action) => {
        state.returnResult = action.payload;
      })
      .addCase(waitForShipGroups.fulfilled, (state, action) => {
        state.waitForShipGroups = action.payload;
      });


    builder.addCase(prepareReturnItem.fulfilled, (state, action) => {
      state.operations.returnItem = {
        status: 'confirm',
        payload: action.payload,
      }
    }).addCase(clearReturnItem.fulfilled, (state) => {
      state.operations.returnItem = {
        status: 'idle',
      }
    });
    
    builder.addCase(returnMany.fulfilled, (state, action) => {
      state.operations.returnItem = {
        status: 'succeeded',
        message: 'ポイント交換が完了しました。'
      }
    }).addCase(returnMany.rejected, (state, action) => {
      state.operations.returnItem = {
        status: 'failed',
        message: 'ポイント交換に失敗しました。'
      }
    });


  
    builder.addCase(createGacha.fulfilled, (state, { payload }) => {
      state.gacha.result = payload;
    });
    builder.addCase(fetchUserGachaHistory.fulfilled, (state, { payload }) => {
      state.gacha.history = payload;
    });

    builder.addCase(fetchCollectionProgress.fulfilled, (state, { payload }) => {
      state.operations.fetchCollectionProgress = {
        status: 'succeeded',
        payload,
      }
    });
    
    /*
    builder.addCase(fetchUserLineItems.fulfilled, (state, { payload }) => {
      state.lineItem.lineItems = payload as types.Paginated<lineItemAPI.LineItem>;
    }).addCase(setCategoryEditMode.fulfilled, (state, { payload }) => {
      state.category.editMode = payload as string;
    }).addCase(setCollectionEditMode.fulfilled, (state, { payload }) => {
      state.collection.editMode = payload as string;
    }).addCase(setCardEditMode.fulfilled, (state, { payload }) => {
      state.oripa.editMode = payload as string;
    }).addCase(getCollectionProgress.fulfilled, (state, { payload }) => {
      state.collection.collectionProgress = payload as cardAPI.CollectionProgress[]
    })
    builder.addCase(clickUpdateCategory.fulfilled, (state, { payload }) => {
      state.operations.updateCategory = {
        status: 'confirm',
        payload: payload,
      }
    


    builder.addCase(clearOperationStatus.fulfilled, (state, { payload }) => {
      state.operations[payload] = {
        status: 'idle',
      }
    });
    */

    builder.addCase(prepareRandomlizeCollection.fulfilled, (state, { payload }) => {
      state.operations.randomlizeCollection = {
        status: 'confirm',
        payload,
      }
    }).addCase(clearRandomlizeCollection.fulfilled, (state) => {
      state.operations.randomlizeCollection = {
        status: 'idle'
      };
    });
    builder.addCase(prepareResetInventory.fulfilled, (state, { payload }) => {
      state.operations.resetCollection = {
        status: 'confirm',
        payload,
      }
    }).addCase(clearResetInventory.fulfilled, (state) => {
      state.operations.resetCollection = {
        status: 'idle'
      };
    });
    builder.addCase(randomlizeCollection.fulfilled, (state, { payload }) => {
      state.operations.randomlizeCollection = {
        status: 'succeeded',
        message: `オリパランダム化に成功しました`,
      }
    }).addCase(randomlizeCollection.rejected, (state, { payload }) => {
      state.operations.randomlizeCollection = {
        status: 'failed',
        message: `オリパランダム化に失敗しました`,
      }
    });
    builder.addCase(resetInventory.fulfilled, (state, { payload }) => {
      state.operations.resetCollection = {
        status: 'succeeded',
        message: `オリパ初期化に成功しました`,
      }
    }).addCase(resetInventory.rejected, (state, { payload }) => {
      state.operations.resetCollection = {
        status: 'failed',
        message: `オリパ初期化に失敗しました`,
      }
    });
    builder.addCase(fetchCollectionInitializeStatus.fulfilled, (state, { payload }) => {
      state.operations.fetchCollectionInitializeStatus = {
        status: 'succeeded',
        payload,
      }
    }).addCase(fetchCollectionInitializeStatus.rejected, (state, { payload }) => {
      state.operations.fetchCollectionInitializeStatus = {
        status: 'failed',
        message: `オリパ初期化状況の取得に失敗しました`,
      }
    });
   
  }
})

export default oripaSlice.reducer
