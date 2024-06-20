"use client"

import { StatusTag } from "@toreca-jp-app/components/admin/status-tag";
import FileUploader from "@toreca-jp-app/components/common/file-uploader";
import { Pagination } from "@toreca-jp-app/components/common/pagination";
import { SimpleBreadcrumb } from "@toreca-jp-app/components/common/simple-breadcrumb";
import { createCard, fetchCards, prepareCreateCard, prepareRemoveCard, prepareUpdateCard, removeCardById, updateCardById } from "@toreca-jp-app/domain/oripa/action/card.action";
import { fetchCategories } from "@toreca-jp-app/domain/oripa/action/category.action";
import { clearOperationStatus } from "@toreca-jp-app/domain/oripa/store";
import { Card } from "@toreca-jp-app/domain/oripa/types/card";

import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks";
import { ArchiveBoxXMarkIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Switch, TextField } from "@mui/material";
import _ from "lodash";
import { pick } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { dialog } from "@commons";
import { showNotification } from "@commons/notification";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

type CardForm = Omit<Card, 'id' | 'status' | 'category'> & { status: boolean };

export default function AdminCardPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const dispatch = useAppDispatch();
  const fetchCategoriesOperation = useAppSelector(state => state.oripa.operations.fetchCategories);
  const fetchCardsOperation = useAppSelector(state => state.oripa.operations.fetchCards);
  const updateCardOperation = useAppSelector(state => state.oripa.operations.updateCard);
  const createCardOperation = useAppSelector(state => state.oripa.operations.createCard);
  const removeCardOperation = useAppSelector(state => state.oripa.operations.removeCard);
  
  const defaultCardFormValues: CardForm = useMemo(() => {
    if (updateCardOperation.payload) {
      return {
        ...pick(updateCardOperation.payload,
          ['name', 'categoryId', 'thumbnail', 'description', 'rarity', 'subImages']),
        status: updateCardOperation.payload.status === 'active'
      }

    } else {
      return {
        name: '',
        description: '',
        categoryId: '',
        thumbnail: '',
        status: true,
        rarity: '',
        subImages: '',
      }
    }
  }, [updateCardOperation.payload]);

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
        card: { ...data, status: data.status ? 'active' : 'inactive' }
      })).unwrap().then(() => {
        dispatch(showNotification({
          shouldShow: true,
          message: 'カード更新しました。',
          severity: 'success'
        }));
        clearOperationStatus('updateCard');
      }).catch((error) => {
        showNotification({
          shouldShow: true,
          message: `カード更新失敗しました。${error.message}`,
          severity: 'error'
        });
        clearOperationStatus('updateCard');
      }).finally(() => {
        dispatch(fetchCards({ collectionId: params.id, orderby: 'createdAt DESC', top: fetchCardsOperation.payload?.limit, skip: fetchCardsOperation.payload?.offset }));
      })
    }
    if (createCardOperation.status === 'confirm') {
      dispatch(createCard({
        ...data,
        status: data.status ? 'active' : 'inactive',
      })).unwrap().then(() => {
        showNotification({
          shouldShow: true,
          message: 'カード作成しました。',
          severity: 'info'
        });
        clearOperationStatus('createCard');
      }).catch((error) => {
        showNotification({
          shouldShow: true,
          message: `カード作成失敗しました。${error.message}`,
          severity: 'error'
        });
        clearOperationStatus('createCard');
      }).finally(() => {
        dispatch(fetchCards({ collectionId: params.id, orderby: 'createdAt DESC' }));
      })
    }
  }


  useEffect(() => {
    dispatch(fetchCategories({ status: 'active' }));
    dispatch(fetchCards({  orderby: 'createdAt DESC' }));
  }, []);


  const closeEditOrCreateDialog = async () => {
    if (updateCardOperation.status === 'confirm') {
      dispatch(clearOperationStatus('updateCard'));
    }
    if (createCardOperation.status === 'confirm') {
      dispatch(clearOperationStatus('createCard'));
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

  return <>
    <div className="flex justify-between px-4 mt-4 sm:px-8">
      <h2 className="text-2xl text-gray-600">カード編集</h2>
      <SimpleBreadcrumb locations={[{ label: 'admin', link: '#' }, { label: 'カード編集', link: '/admin/card' }]} />
    </div>

    <div className="p-4 mt-8 sm:px-8 sm:py-4">

      <div className="p-4 bg-white rounded">
        <div className="flex justify-between">
          <PrimaryButton className="bg-primary-admin"  onClick={() => dispatch(prepareCreateCard())}>カード追加</PrimaryButton>
        </div>
        <div>
        </div>
        <section className="bg-white dark:bg-gray-900">
        <table className="w-full mt-2 text-gray-500">
          <thead className="border-b">
            <tr>
              <th className="text-left text-gray-600">オリパ</th>
              <th className="text-left text-gray-600">プレビュー</th>
              <th className="text-left text-gray-600">ステータス</th>
              <th className="text-right text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fetchCardsOperation.payload?.data.map((card, index) =>
              <tr key={index} className="cursor-pointer hover:bg-slate-100">
                <td className="flex items-center py-4">
                  {card.name}
                </td>
                <td >
                  <img src={card.thumbnail} height="30" width="30" />
                </td>
                <td>
                  <StatusTag status={card.status} />
                </td>
                <td className="text-right">
                  <div className="flex justify-end space-x-5">
                    <Button variant="outlined" className="bg-primary" onClick={() => dispatch(prepareUpdateCard(card))}>
                      <PencilIcon strokeWidth={2} className="h-5 w-5" />
                    </Button>

                    <Button variant="outlined" className="bg-primary" onClick={() => dispatch(prepareRemoveCard(card))}>
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
              {
          fetchCardsOperation.payload &&
          <Pagination total={fetchCardsOperation.payload.total} count={fetchCardsOperation.payload.count} offset={fetchCardsOperation.payload.offset} limit={fetchCardsOperation.payload.limit} onPage={function (page: number, limit: number): void {
            dispatch(fetchCards({ collectionId: params.id, skip: (page - 1) * limit, top: limit, orderby: 'createdAt DESC' }))
          }} />
        }
              </td>
            </tr>
          </tfoot>
        </table>
        </section>
        
        
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
              <span>カード名</span><TextField fullWidth size="small" {...field} label="カード名" /></div>}
          />
          <Controller
            name="description"
            control={cardForm.control}
            render={({ field }) => <div>
              <span>説明</span><TextField fullWidth size="small" {...field} label="説明" /></div>}
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
            name="rarity"
            control={cardForm.control}
            render={({ field }) => <div>
              <span>レアリティ</span><TextField fullWidth size="small" {...field} placeholder="レアリティ" />
            </div>}
          />
          <Controller
          name="categoryId"
          control={cardForm.control}
          render={({ field }) => <Select {...field} label="カテゴリー">
            {fetchCategoriesOperation.payload?.data.map((category, index) => <MenuItem key={index} value={category.id}>{category.name}</MenuItem>)}
          </Select>}
        />
          
          <Controller
            name="status"
            control={cardForm.control}
            render={({ field }) => <div>
              <span>ステータス</span><Switch checked={field.value} onChange={field.onChange} /></div>}
          />

        </div>

      </dialog.FormDialog>
      <Dialog open={removeCardOperation.status === 'confirm'} onClose={() => dispatch(clearOperationStatus('removeCard'))}>

        <DialogTitle>カード</DialogTitle>
        <DialogContent>
          カード{removeCardOperation.payload && removeCardOperation.payload.name}を削除しますか？
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={() => dispatch(clearOperationStatus('removeCard'))}
            className="mr-1"
          >
            <span>キャンセル</span>
          </Button>
          <Button onClick={() => {
            if (!removeCardOperation.payload) {
              alert("カードが選択されていません。");
              return;
            }
            dispatch(removeCardById(removeCardOperation.payload.id)).then(() => {
              dispatch(fetchCards({ collectionId: params.id, orderby: 'createdAt DESC', top: fetchCardsOperation.payload?.limit, skip: fetchCardsOperation.payload?.offset }));
            })
            //dispatch(clearOperationStatus('deleteCard'))
          }}>
            <span>削除</span>
          </Button>
        </DialogActions>

      </Dialog>
    </div >

  </>
}

//{updateCardOperation.message || createCardOperation.message || removeCardOperation.message || ''}