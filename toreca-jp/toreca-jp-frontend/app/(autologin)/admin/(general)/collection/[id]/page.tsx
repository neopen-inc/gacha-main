"use client"

import { SimpleBreadcrumb } from "@toreca-jp-app/components/common/simple-breadcrumb";
import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks";
import { useEffect, useMemo } from "react";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/solid";
import { Pagination } from "@toreca-jp-app/components/common/pagination";
import { Controller, useForm } from "react-hook-form";
import _, { pick, throttle }  from "lodash";

import { fetchCollectionById } from "@toreca-jp-app/domain/oripa/action/collection.action";
import { fetchCards } from "@toreca-jp-app/domain/oripa/action/card.action";
import { clearRandomlizeCollection, clearResetInventory, createCardToOripa, fetchCardToOripaByCollection, prepareCreateCardToOripa, prepareRandomlizeCollection, prepareRemoveCardToOripa, prepareResetInventory, prepareUpdateCardToOripa, randomlizeCollection, removeCardToOripaById, resetInventory, updateCardToOripaById } from "@toreca-jp-app/domain/oripa/action/card-to-oripa.action";
import { clearOperationStatus } from "@toreca-jp-app/domain/oripa/store";
import { PostCardToOripaDto } from "@toreca-jp-app/domain/oripa/dto/card-to-oripa";
import { Autocomplete, Box, Button, Dialog, DialogContent, DialogTitle, FormControlLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import { dialog } from "@commons";
import { PrimaryButton } from "@commons/components/buttons/primary-button";
import { IconPencil } from "@toreca-jp-app/components/icons/pencil";

type CardToOripaForm = Omit<PostCardToOripaDto, 'status'> & { status: boolean; cardId: string };

export default function CardToOripaAdminPage({ params }: { params: { id: string } } ) {
  const dispatch = useAppDispatch();
  const collection = useAppSelector(state => state.oripa.operations.fetchCollectionById.payload);
  const fetchCardToOripaByCollectionOperation = useAppSelector(state => state.oripa.operations.fetchCardToOripaByCollection);
  const removeCardToOripaByIdOperation = useAppSelector(state => state.oripa.operations.removeCardToOripaById);
  const createCardToOripaOperation = useAppSelector(state => state.oripa.operations.createCardToOripa);
  const updateCardToOripaOperation = useAppSelector(state => state.oripa.operations.updateCardToOripaById);
  const fetchCollectionByIdOperation = useAppSelector(state => state.oripa.operations.fetchCollectionById);
  const cards = useAppSelector(state => state.oripa.operations.fetchCards.payload);
  const randomlizeCollectionOperation = useAppSelector(state => state.oripa.operations.randomlizeCollection);
  const resetCollectionOperation = useAppSelector(state => state.oripa.operations.resetCollection);
  
  useEffect(() => {
    dispatch(fetchCollectionById(params.id));
    dispatch(fetchCardToOripaByCollection({collectionId: params.id}));
    dispatch(fetchCards({}));
  }, []);
  const defaultCardToOripaFormValues: CardToOripaForm = useMemo(() => {
    if (updateCardToOripaOperation.payload) {
      const { id, ...rest } = updateCardToOripaOperation.payload;
      return {
        seq: rest.seq,
        cardId: rest.cardId,
        grade: rest.grade,
        inventory: rest.inventory,
        initialInventory: rest.initialInventory,
        probability: rest.probability,
        appearance: rest.appearance,
        point: rest.point,
        status: updateCardToOripaOperation.payload.status === 'active',
      }
    } else {
      return {
        seq: 0,
        cardId: '',
        grade: '1',
        inventory: 0,
        initialInventory: 0,
        probability: 0,
        appearance: 0,
        point: 0,
        status: true,
      }
    }
  }, [updateCardToOripaOperation.payload, createCardToOripaOperation.status, updateCardToOripaOperation.status]);

  const cardToOripaForm = useForm({
    defaultValues: defaultCardToOripaFormValues
  });

  useEffect(() => {
    cardToOripaForm.reset(defaultCardToOripaFormValues);
  }, [cardToOripaForm, defaultCardToOripaFormValues]);


  const onSubmit = (data: CardToOripaForm) => {
    console.log(data);
    const { cardId, ...rest } = data;
    if (createCardToOripaOperation.status === 'confirm') {
      dispatch(createCardToOripa({
        cardId,
        collectionId: params.id,
        createCardToOripaDto: {
          ...rest,
          status: data.status ? 'active' : 'inactive'
        }
      })).then(() => {
        dispatch(clearOperationStatus('createCardToOripa'));
      }).finally(() => {
        dispatch(fetchCardToOripaByCollection({
          collectionId: params.id,
          cardListDto: {
            orderby: 'seq asc, createdAt desc'
          }
        }));
      })
    } else if (updateCardToOripaOperation.status === 'confirm') {
      if (updateCardToOripaOperation.payload?.id) {

        dispatch(updateCardToOripaById({
          id: updateCardToOripaOperation.payload.id,
          patchCardToOripaDto: {
            ...rest,
            status: data.status ? 'active' : 'inactive'
          }
        })).then(() => {
          dispatch(clearOperationStatus('updateCardToOripaById'));
        }).finally(() => {
          dispatch(fetchCardToOripaByCollection({
            collectionId: params.id,
            cardListDto: {
              orderby: 'seq asc, createdAt desc'
            }
          }));
        });
      }
    }
  }

  const throttleFetch = _.throttle((name: string) => {
    dispatch(fetchCards({ name, top: 100}));
  }, 1000);
  
  return <>
    <div className="flex justify-between px-4 mt-4 sm:px-8">
      <h2 className="text-2xl text-gray-600">オリパ &nbsp; {collection?.name}</h2>
      <SimpleBreadcrumb locations={[{ label: 'admin', link: '#' }, { label: 'オリパ', link: '/admin/collection' }]} />
    </div>

    <div className="p-4 mt-8 sm:px-8 sm:py-4">
      <div className="p-4 bg-white rounded">
        <div className="flex justify-between">
          <div>
            <div>
              <PrimaryButton className="bg-primary-admin" onClick={() => dispatch(prepareCreateCardToOripa())}>新規作成</PrimaryButton>
              <PrimaryButton className="bg-primary-admin" onClick={() => {
              if (!collection) {
                alert("オリパが選択されていません。");
                return;
              }
              dispatch(prepareRandomlizeCollection(collection))
            }}>順番作成</PrimaryButton>
            <PrimaryButton className="bg-primary-admin" onClick={() => {
              if (!collection) {
                alert("オリパが選択されていません。");
                return;
              }
              dispatch(prepareResetInventory(collection))
            }}>在庫初期化</PrimaryButton>
            </div>
          </div>
        </div>
        <table className="w-full mt-2 text-gray-500">
          <thead className="border-b">
            <tr>
              <th className="text-left text-gray-600">オリパ名</th>
              <th className="text-left text-gray-600">カード名</th>
              <th className="text-left text-gray-600">プレビュー</th>
              <th className="text-left text-gray-600">ポイント</th>
              <th className="text-left text-gray-600">グレード</th>
              <th className="text-left text-gray-600">在庫</th>
              <th className="text-left text-gray-600">初期在庫</th>
              <th className="text-left text-gray-600">ステータス</th>
              <th className="text-right text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fetchCardToOripaByCollectionOperation.payload?.data.map((cardToOripa, index) =>
              <tr key={index} className="cursor-pointer hover:bg-slate-100 py-4 items-center">
                <td className="">
                  {fetchCollectionByIdOperation.payload?.name}
                </td>
                <td>
                  {cardToOripa.card?.name || "カードが削除されました"}
                </td>
                <td>
                  <img src={cardToOripa.card?.thumbnail} className="h-20"/>
                </td>
                <td>
                  {cardToOripa.point}
                </td>
                <td>
                  {cardToOripa.grade}
                </td>
                <td>
                  {cardToOripa.inventory}
                </td>
                <td>
                  {cardToOripa.initialInventory}
                </td>
                <td>
                  {cardToOripa.status}
                </td>
                
                <td className="text-right">
                  <div className="flex justify-end space-x-5">
                    <a onClick={() => dispatch(prepareUpdateCardToOripa(cardToOripa))}>
                      <IconPencil />
                    </a>
                    <Button variant="outlined" className="bg-primary" onClick={() => dispatch(prepareRemoveCardToOripa(cardToOripa))}>
                      <ArchiveBoxXMarkIcon strokeWidth={2} className="h-5 w-5" />
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}>
               { fetchCardToOripaByCollectionOperation.payload &&
                <Pagination total={fetchCardToOripaByCollectionOperation.payload.total}
                  count={fetchCardToOripaByCollectionOperation.payload.count}
                  offset={fetchCardToOripaByCollectionOperation.payload.offset}
                  limit={fetchCardToOripaByCollectionOperation.payload.limit}
                  onPage={
                    (page: number, limit: number) => {
                      dispatch(fetchCardToOripaByCollection({ collectionId: params.id, cardListDto: { skip: (page - 1) * limit, top: limit, orderby: 'createdAt DESC' } }))
                    }
                  } />
                }
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <dialog.FormDialog open={ createCardToOripaOperation.status === 'confirm' || updateCardToOripaOperation.status === 'confirm' }
      okText={'作成'}
      title={'カードーオリパ紐付け'}
      cancel={() => {
        dispatch(clearOperationStatus('createCardToOripa'))
        dispatch(clearOperationStatus('updateCardToOripaById'))
      }}
      submit={cardToOripaForm.handleSubmit(onSubmit)
      }>
        
      <div className="space-y-4">
        {
          createCardToOripaOperation.status === 'confirm' &&
          <Controller
          name="cardId"
          control={cardToOripaForm.control}
          render={({ field }) => <><span>カード</span>
          <Autocomplete
            disablePortal
            filterOptions={(x) => x}
            options={cards?.data.map((card, index) => ({ label: card.name, value: card.id })) || []}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} 
              label="カード" 
              onChange={async (event) => {
                throttleFetch(event.target.value);
              }}
            />}
            onChange={(event, value) => {
              cardToOripaForm.setValue('cardId', value?.value || '');
            }}
          />
          </>}
        />
        }
        
        <Controller
          name="grade"
          control={cardToOripaForm.control}
          render={({ field }) => <TextField fullWidth size="small" {...field} label="グレード" />}
        />
        <Controller
          name="initialInventory"
          control={cardToOripaForm.control}
          render={({ field }) => <TextField fullWidth size="small" {...field} label="初期在庫" />}
        />
        <Controller
          name="inventory"
          control={cardToOripaForm.control}
          render={({ field }) => <TextField fullWidth size="small" {...field} label="在庫" />}
        />
        <Controller
          name="appearance"
          control={cardToOripaForm.control}
          render={({ field }) => <div>
            <TextField fullWidth size="small" {...field} label="抽選順番" />
            <div>在庫、初期在庫1のカード指定できます。</div>
          </div>}
        />
        <Controller
          name="point"
          control={cardToOripaForm.control}
          render={({ field }) => <TextField fullWidth size="small" {...field} label="ポイント" />}
        />

        <Controller
          name="seq"
          control={cardToOripaForm.control}
          render={({ field }) => <TextField fullWidth size="small" label="順番" type="number" {...field} />}
        />
        
        <Controller
          name="status"
          control={cardToOripaForm.control}
          render={({ field }) => <FormControlLabel control={<Switch checked={field.value} onChange={field.onChange} />} label="ステータス" />}
        />
      </div>
    </dialog.FormDialog>
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
          dispatch(resetInventory(resetCollectionOperation.payload.id)).then(() => {
            dispatch(fetchCardToOripaByCollection({collectionId: params.id}));
          });
        }}
      >
        オリパ在庫を初期化しますか？
        危険な操作です。実行すると、オリパ在庫数を初期化します。
      </dialog.ConfirmDialog>

      <dialog.ConfirmDialog title='オリパからカードを削除' 
        shouldOpen={removeCardToOripaByIdOperation.status === 'confirm'} 
        cancel={() => dispatch(clearOperationStatus('removeCardToOripaById'))}
        confirm={() => {
          if (!removeCardToOripaByIdOperation.payload) {
            alert("カードを選択してください。");
            return;
          }
          dispatch(removeCardToOripaById(removeCardToOripaByIdOperation.payload.id)).unwrap().then(() => {
            dispatch(fetchCardToOripaByCollection({collectionId: params.id}));
          }).finally(() => {
            dispatch(clearOperationStatus('removeCardToOripaById'));
          });
        }}
      >
        カード{removeCardToOripaByIdOperation.payload?.card?.name}を削除しますか？
      </dialog.ConfirmDialog>
  </>
}