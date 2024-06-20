"use client"

import _, { isUndefined, omitBy } from "lodash";
import { dialog, notification } from "@commons";
import { CardEdit } from "@gacha-labs-app/components/common/card-edit";
import FileUploader from "@gacha-labs-app/components/common/file-uploader";
import { Pagination } from "@gacha-labs-app/components/common/pagination";
import { SimpleBreadcrumb } from "@gacha-labs-app/components/common/simple-breadcrumb";
import { Card } from "@gacha-labs-app/domain/types";
import { fetchCards, createCard, updateCardById, prepareCreateCard, prepareUpdateCard, prepareRemoveCard, removeCardById, prepareRandomlizeCollection, randomlizeCollection, prepareResetInventory, resetInventory, fetchCollectionById, clearUpdateCard, clearCreateCard, clearRemoveCard, clearRandomlizeCollection, clearResetInventory } from "@gacha-labs-app/domain/oripa/action";
import { useAppDispatch, useAppSelector } from "@gacha-labs-app/store/hooks";
import { Button, FormControlLabel, Switch, TextField } from "@mui/material";
import { pick } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type CardForm = Omit<Card, 'id' | 'status' | 'pickup'> & { status: boolean; pickup: boolean };

export default function AdminCardPage({
  params,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [cardName, setCardName] = useState<string |undefined>(undefined);
  const [cardGrade, setCardGrade] = useState<string |undefined>(undefined);
  const updateCardOperation = useAppSelector(state => state.oripa.operations.updateCard);
  const createCardOperation = useAppSelector(state => state.oripa.operations.createCard);
  const removeCardOperation = useAppSelector(state => state.oripa.operations.removeCard);
  const fetchCardsOperation = useAppSelector(state => state.oripa.operations.fetchCards);
  const fetchCollectionByIdOperation = useAppSelector(state => state.oripa.operations.fetchCollectionById);

  useEffect(() => {
    dispatch(fetchCollectionById(params.id));
  }, []);

  const defaultCardFormValues: CardForm = useMemo(() => {
    if (updateCardOperation.payload) {
      return {
        ...pick(updateCardOperation.payload,
          ['name', 'collectionId', 'thumbnail', 'description', 'points', 'grade', 'probability', 'subImages', 'inventory', 'initialInventory' , 'appearance']),
        status: updateCardOperation.payload.status === 'active',
        pickup: updateCardOperation.payload.pickup === 1,
      }

    } else {
      return {
        name: '',
        description: '',
        collectionId: fetchCollectionByIdOperation.payload?.id || '',
        thumbnail: '',
        points: 0,
        grade: '1',
        probability: 0,
        status: true,
        subImages: '',
        initialInventory: 0,
        inventory: 0,
        appearance: 0,
        pickup: false,
      }
    }
  }, [fetchCollectionByIdOperation.payload?.id, updateCardOperation.payload]);

  const cardForm = useForm({
    defaultValues: defaultCardFormValues
  });

  useEffect(() => {
    cardForm.reset(defaultCardFormValues);
  }, [cardForm, defaultCardFormValues]);


  const onSubmit = (data: CardForm) => {
    if (updateCardOperation.status === 'confirm' && updateCardOperation.payload) {
      dispatch(updateCardById({
        id: updateCardOperation.payload.id,
        card: { ...data, collectionId: params.id, status: data.status ? 'active' : 'inactive', pickup: data.pickup ? 1 : 0 }
      })).unwrap().then(() => {
        dispatch(notification.showNotification({
          severity: 'success',
          message: 'カード更新しました。'
          }))
      }).catch(() => {
        dispatch(notification.showNotification({
          severity: 'error',
          message: 'カードの更新に失敗しました。'
          }))
      }).finally(() => {
        dispatch(fetchCards(omitBy({ collectionId: params.id, orderby: 'createdAt DESC', top: fetchCardsOperation.payload?.limit, skip: fetchCardsOperation.payload?.offset, grade: cardGrade, name: cardName }, isUndefined)));
        dispatch(clearUpdateCard());
      })
    }
    if (createCardOperation.status === 'confirm') {
      dispatch(createCard({
        ...data,
        collectionId: params.id,
        status: data.status ? 'active' : 'inactive', pickup: data.pickup ? 1 : 0
      })).unwrap().then(() => {
        dispatch(notification.showNotification({
          severity: 'success',
          message: 'カード作成しました。'
          }))
      }).catch(() => {
        dispatch(notification.showNotification({
          severity: 'error',
          message: 'カード作成失敗しました。'
          }))
      }).finally(() => {
        dispatch(fetchCards(omitBy({ collectionId: params.id, orderby: 'createdAt DESC', top: fetchCardsOperation.payload?.limit, skip: fetchCardsOperation.payload?.offset, grade: cardGrade, name: cardName }, isUndefined)));
        dispatch(clearCreateCard());
      })
    }
  }


  useEffect(() => {
    dispatch(fetchCards(omitBy({ collectionId: params.id, orderby: 'createdAt DESC',  grade: cardGrade, name: cardName }, isUndefined)));
  }, []);


  const closeEditOrCreateDialog = async () => {
    if (updateCardOperation.status === 'confirm') {
      dispatch(clearUpdateCard());
    }
    if (createCardOperation.status === 'confirm') {
      dispatch(clearCreateCard());
    }
  }
  const editOrCreateDialogTitle = (): string => {
    if (updateCardOperation.status === 'confirm') {
      return 'オリパ編集';
    }
    if (createCardOperation.status === 'confirm') {
      return 'オリパ作成';
    }
    return '';
  }
  const editOrCreateDialogConfirmButtonLabel = (): string => {
    if (updateCardOperation.status === 'confirm') {
      return '更新';
    }
    if (createCardOperation.status === 'confirm') {
      return '作成';
    }
    return '';
  }

  const randomlizeCollectionOperation = useAppSelector(state => state.oripa.operations.randomlizeCollection);
  const resetCollectionOperation = useAppSelector(state => state.oripa.operations.resetCollection);
  return <>
    <div className="flex justify-between px-4 mt-4 sm:px-8">
      <h2 className="text-2xl text-gray-600">{fetchCollectionByIdOperation.payload && fetchCollectionByIdOperation.payload.name}詳細</h2>
      <SimpleBreadcrumb locations={[{ label: 'admin', link: '#' }, { label: 'オリパ', link: '/admin/collection' }, { label: '詳細', link: '/admin/collection' }]} />
    </div>

    <div className="p-4 mt-8 sm:px-8 sm:py-4">

      <div className="p-4 bg-white rounded">
        <div className="flex justify-between ">
          <div className="flex justify-start  gap-2">
            <TextField size="small" type="text" placeholder="グレード" onChange={(event) => event.target.value.length === 0 ? setCardGrade(undefined) : setCardGrade(event.target.value)}/>
            <TextField size="small" type="text" placeholder="カード名" onChange={(event) => event.target.value.length === 0 ? setCardName(undefined) : setCardName(event.target.value)}/>
            <Button variant="outlined" size="small" onClick={() => {
              dispatch(fetchCards(omitBy({ collectionId: params.id, orderby: 'createdAt DESC', grade: cardGrade, name: cardName }, isUndefined)));
            }}>
              絞り込み
            </Button>
          </div>
          <Button size="small" variant='contained' onClick={() => dispatch(prepareCreateCard())}>カード追加</Button>
          <Button size="small" variant='contained' onClick={() => {
            if (!fetchCollectionByIdOperation.payload) {
              alert("オリパが選択されていません。");
              return;
            }
            dispatch(prepareRandomlizeCollection(fetchCollectionByIdOperation.payload))
          }}>順番作成</Button>
          <Button size="small" variant='contained' onClick={() => {
            if (!fetchCollectionByIdOperation.payload) {
              alert("オリパが選択されていません。");
              return;
            }
            dispatch(prepareResetInventory(fetchCollectionByIdOperation.payload))
          }}>在庫初期化</Button>
        </div>
        <div>
        </div>
        <section className="bg-white">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
            <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
              {fetchCardsOperation.payload?.data.map((card, index) =>
                <CardEdit
                  key={index}
                  thumbnail={card.thumbnail}
                  name={card.name}
                  inventory={card.inventory}
                  grade={card.grade}
                  appearance={card.appearance}
                  initialInventory={card.initialInventory}
                  onEdit={() => dispatch(prepareUpdateCard(card))} onDelete={function (): void {
                    dispatch(prepareRemoveCard(card));
                  } }/>
              )}

            </div>
          </div>
        </section>
        <Pagination total={fetchCardsOperation.payload?.total || 0} count={fetchCardsOperation.payload?.count || 0} offset={fetchCardsOperation.payload?.offset || 0} limit={fetchCardsOperation.payload?.limit || 0} onPage={function (page: number, limit: number): void {
          dispatch(fetchCards(omitBy({ collectionId: params.id, orderby: 'createdAt DESC', skip: (page - 1) * limit, top: limit, grade: cardGrade, name: cardName }, isUndefined)))
        }} />
      </div >


      <dialog.FormDialog open={updateCardOperation.status === 'confirm' || createCardOperation.status === 'confirm'}
        okText={editOrCreateDialogConfirmButtonLabel()}
        title={editOrCreateDialogTitle()}
        cancel={closeEditOrCreateDialog}
        submit={cardForm.handleSubmit(onSubmit)
        }>
        <div className="space-y-4">
          <Controller
            name="name"
            control={cardForm.control}
            render={({ field }) => <div>
              <TextField {...field} label="カード名" size="small" />
            </div>}
          />
          <Controller
            name="description"
            control={cardForm.control}
            render={({ field }) => <div>
              <TextField {...field} label="説明" size="small" />
            </div>}
          />
          <Controller
            name="thumbnail"
            control={cardForm.control}
            render={({ field }) => <div>
              <span>画像</span>
              <FileUploader onUploaded={(url) => { cardForm.setValue('thumbnail', url) }} />
              <img src={field.value} className="h-20 object-cover" />
              <input type="hidden" {...field} />
            </div>}
          />
          <Controller
            name="subImages"
            control={cardForm.control}
            render={({ field }) => <div>
              <span>サブ画像</span>
              <FileUploader onUploaded={(url) => { cardForm.setValue('subImages', url) }} />
              <img src={field.value} className="h-20 object-cover" />
              <input type="hidden" {...field} />
            </div>}
          />
          <Controller
            name="points"
            control={cardForm.control}
            render={({ field }) => <div>
              <TextField {...field} label="ポイント" size="small" />
              </div>}
          />
          
          <Controller
            name="appearance"
            control={cardForm.control}
            render={({ field }) => <div>
              <TextField {...field} label="番目" size="small" />
            </div>}
          />
          <Controller
            name="grade"
            control={cardForm.control}
            render={({ field }) => <div>
              <TextField {...field} label="グレード" size="small" />
            </div>}
          />
          <Controller
            name="inventory"
            control={cardForm.control}
            render={({ field }) => <div>
              <TextField {...field} label="在庫" size="small" />
            </div>}
          />
          <Controller
            name="initialInventory"
            control={cardForm.control}
            render={({ field }) => <div>
              <TextField {...field} label="初期在庫" size="small" />
            </div>}
          />
          <Controller
            name="pickup"
            control={cardForm.control}
            render={({ field }) => <>
            <FormControlLabel control={<Switch checked={field.value} onChange={field.onChange} size="small" />} label="オリパに表示" />
            <br />
            </>}
          />
          <Controller
            name="status"
            control={cardForm.control}
            render={({ field }) => <div>
              <FormControlLabel control={<Switch {...field} />} label="公開" />
            </div>}
          />

        </div>
      </dialog.FormDialog>
      <dialog.ConfirmDialog 
      title="カードを削除"
      shouldOpen={removeCardOperation.status === 'confirm'} 
      cancel={() => dispatch(clearRemoveCard())}
      confirm={() => {
        if (!removeCardOperation.payload) {
          alert("カードが選択されていません。");
          return;
        }
        dispatch(removeCardById(removeCardOperation.payload.id)).then(() => {
          dispatch(fetchCards(omitBy({ collectionId: params.id, orderby: 'createdAt DESC', top: fetchCardsOperation.payload?.limit, skip: fetchCardsOperation.payload?.offset, grade: cardGrade, name: cardName }, isUndefined)));
        })
        dispatch(clearRemoveCard())
      }}>
        カード{removeCardOperation.payload && removeCardOperation.payload.name}を削除しますか？
      </dialog.ConfirmDialog>
      <dialog.ConfirmDialog title='オリパ順番を初期化する' 
        shouldOpen={randomlizeCollectionOperation.status === 'confirm'} 
        cancel={() => dispatch(clearRandomlizeCollection())}
        confirm={() => {
          if (!randomlizeCollectionOperation.payload) {
            alert("オリパが選択されていません。");
            return;
          }
          dispatch(randomlizeCollection(randomlizeCollectionOperation.payload.id));
        }}
      >
        オリパ順番を初期化しますか？
        危険な操作です。実行すると、オリパ順番が初期化されます。
      </dialog.ConfirmDialog>

      <dialog.ConfirmDialog title='オリパ在庫を初期化する' 
        shouldOpen={resetCollectionOperation.status === 'confirm'} 
        cancel={() => dispatch(clearResetInventory())}
        confirm={() => {
          if (!resetCollectionOperation.payload) {
            alert("オリパが選択されていません。");
            return;
          }
          dispatch(resetInventory(resetCollectionOperation.payload.id));
        }}
      >
        オリパ在庫を初期化しますか？
        危険な操作です。実行すると、オリパ在庫数を初期化します。
      </dialog.ConfirmDialog>
    </div >

  </>
}