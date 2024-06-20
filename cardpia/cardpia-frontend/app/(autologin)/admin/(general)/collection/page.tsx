"use client"

import _ from "lodash";
import React from "react";
import { StatusTag } from "@cardpia-app/components/admin/status-tag";
import { SimpleBreadcrumb } from "@cardpia-app/components/common/simple-breadcrumb";
import { createCollection, fetchCollections, fetchCategories, removeCollection, updateCollection, prepareCreateCollection, prepareUpdateCollection, prepareRemoveCollection, fetchCollectionInitializeStatus, clearUpdateCollection, clearCreateCollection, clearRemoveCollection } from "@cardpia-app/domain/oripa/action";
import { useAppDispatch, useAppSelector } from "@cardpia-app/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { dialog } from "@commons";
import { ArchiveBoxXMarkIcon, DocumentTextIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Pagination } from "@cardpia-app/components/common/pagination";
import { Controller, useForm } from "react-hook-form";
import FileUploader from "@cardpia-app/components/common/file-uploader";
import Switch from '@mui/material/Switch';
import { Button, FormControlLabel, MenuItem, Select, TextField } from "@mui/material";
import { notification } from "@commons";
import { CollectionCardCount } from "@cardpia-app/domain/oripa/dto";
import { Collection } from "@cardpia-app/domain/types";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

type CollectionForm = Omit<Collection, 'id' | 'status' | 'pickup'> & { status: boolean, pickup: boolean };
export default function AdminCollectionDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCategories({}));
    dispatch(fetchCollections({
      orderby: 'seq desc, createdAt desc'
    }));
  }, []);

  const [collectionInitializeStatusMap, setCollectionInitializeStatusMap] = React.useState<{ [key: string]: CollectionCardCount }>({});
  
  const fetchCategoriesOperation = useAppSelector(state => state.oripa.operations.fetchCategories);
  const fetchCollectionsOperation = useAppSelector(state => state.oripa.operations.fetchCollections);
  const updateCollectionOperation = useAppSelector(state => state.oripa.operations.updateCollection);
  const createCollectionOperation = useAppSelector(state => state.oripa.operations.createCollection);
  const removeCollectionOperation = useAppSelector(state => state.oripa.operations.removeCollection);
  const fetchCollectionInitializeStatusOperation = useAppSelector(state => state.oripa.operations.fetchCollectionInitializeStatus);

  useEffect(() => {
    if (!fetchCollectionsOperation.payload) {
      return ;
    }
    const idList = fetchCollectionsOperation.payload.data.map(collection => collection.id);
    dispatch(fetchCollectionInitializeStatus(idList));
  }, [fetchCollectionsOperation.payload])
  useEffect(() => {
    if (fetchCollectionInitializeStatusOperation.status === 'succeeded' && fetchCollectionInitializeStatusOperation.payload) {
      const map: { [key: string]: CollectionCardCount } = fetchCollectionInitializeStatusOperation.payload.reduce((acc, cur) => {
        acc[cur.collectionId] = cur
        return acc;
      }, {} as { [key: string]: CollectionCardCount });
      setCollectionInitializeStatusMap(map);
    }
  }, [fetchCollectionInitializeStatusOperation])

  const defaultCollectionFormValues: CollectionForm = useMemo(() => {
    if (updateCollectionOperation.payload) {
      return {
        name: updateCollectionOperation.payload.name,
        description: updateCollectionOperation.payload.description,
        thumbnail: updateCollectionOperation.payload.thumbnail,
        background: updateCollectionOperation.payload.background,
        subImages: updateCollectionOperation.payload.subImages,
        gacha1Points: updateCollectionOperation.payload.gacha1Points,
        gacha10Points: updateCollectionOperation.payload.gacha10Points,
        categoryId: updateCollectionOperation.payload.categoryId,
        status: updateCollectionOperation.payload.status === 'active',
        once: updateCollectionOperation.payload.once,
        oncePerDay: updateCollectionOperation.payload.oncePerDay,
        pickup: updateCollectionOperation.payload.pickup === 1,
        seq: updateCollectionOperation.payload.seq,
      }
    } else {
      return {
        name: '',
        description: '',
        thumbnail: '',
        background: '',
        gacha1Points: 0,
        gacha10Points: 0,
        seq: 0,
        categoryId: '',
        status: true,
        once: false,
        oncePerDay: false,
        pickup: false,
        subImages: '',
      }
    }
  }, [updateCollectionOperation]);

  const collectionForm = useForm({
    defaultValues: defaultCollectionFormValues
  });

  useEffect(() => {
    collectionForm.reset(defaultCollectionFormValues);
  }, [collectionForm, defaultCollectionFormValues]);

  const onSubmit = (data: CollectionForm) => {
    if (updateCollectionOperation.status === 'confirm' && updateCollectionOperation.payload) {
      dispatch(updateCollection({
        id: updateCollectionOperation.payload.id,
        collection: { ...data, status: data.status ? 'active' : 'inactive', pickup: data.pickup ? 1 : 0 }
      })).unwrap().then(() => {
        dispatch(notification.showNotification({
          message: '更新しました。',
          severity: 'success'
        }));
      }).catch(() => {
        dispatch(notification.showNotification({
          message: '更新に失敗しました。',
          severity: 'error'
        }));
      }).finally(() => {
        dispatch(fetchCollections({
          orderby: 'seq desc, createdAt desc'
        }));
        dispatch(clearUpdateCollection());
      })
    }
    if (createCollectionOperation.status === 'confirm') {
      dispatch(createCollection({
        ...data,
        pickup: data.pickup ? 1 : 0,
        status: data.status ? 'active' : 'inactive',
      })).unwrap().then(() => {
        dispatch(notification.showNotification({
          message: '作成しました。',
          severity: 'success'
        }));
      }).catch(() => {
        dispatch(notification.showNotification({
          message: '作成に失敗しました。',
          severity: 'error'
        }));
      }).finally(() => {
        dispatch(fetchCollections({
          orderby: 'seq desc, createdAt desc'
        }));
        dispatch(clearCreateCollection());
      })
    }
  }

  const closeEditOrCreateDialog = async () => {
    if (updateCollectionOperation.status === 'confirm') {
      dispatch(clearUpdateCollection());
    }
    if (createCollectionOperation.status === 'confirm') {
      dispatch(clearCreateCollection());
    }
  }
  const editOrCreateDialogTitle = (): string => {
    if (updateCollectionOperation.status === 'confirm') {
      return 'オリパ編集';
    }
    if (createCollectionOperation.status === 'confirm') {
      return 'オリパ作成';
    }
    return '';
  }
  const editOrCreateDialogConfirmButtonLabel = (): string => {
    if (updateCollectionOperation.status === 'confirm') {
      return '更新';
    }
    if (createCollectionOperation.status === 'confirm') {
      return '作成';
    }
    return '';
  }

  return <>
    <div className="flex justify-between px-4 mt-4 sm:px-8">
      <h2 className="text-2xl text-gray-600">オリパ</h2>
      <SimpleBreadcrumb locations={[{ label: 'admin', link: '#' }, { label: 'オリパ', link: '/admin/collection' }]} />
    </div>

    <div className="p-4 mt-8 sm:px-8 sm:py-4">
      <div className="p-4 bg-white rounded">
        <div className="flex justify-between">
          <PrimaryButton onClick={() => dispatch(prepareCreateCollection())}>新規作成</PrimaryButton>
        </div>
        <table className="w-full mt-2 text-gray-500">
          <thead className="border-b">
            <tr>
              <th className="text-left text-gray-600">オリパ</th>
              <th className="text-left text-gray-600">プレビュー</th>
              <th className="text-left text-gray-600">ステータス</th>
              <th className="text-left text-gray-600">カード数</th>
              <th className="text-left text-gray-600">ガチャされたカード数</th>
              <th className="text-right text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fetchCollectionsOperation.payload?.data.map((collection, index) =>
              <tr key={index} className="cursor-pointer hover:bg-slate-100">
                <td className="flex items-center py-4">
                  {collection.name}
                </td>
                <td >
                  <img src={collection.thumbnail} height="30" width="30" />
                </td>
                <td>
                  <StatusTag status={collection.status} />
                </td>
                <td>
                  {collectionInitializeStatusMap[collection.id]?.cnt || 0}
                </td>
                <td>
                  {collectionInitializeStatusMap[collection.id]?.processed || 0}
                </td>
                <td className="text-right">
                  <div className="flex justify-end space-x-5">
                    <Button size="small" variant="outlined" onClick={() => router.push(`/admin/collection/${collection.id}`)}>
                      <DocumentTextIcon strokeWidth={2} className="h-5 w-5" />
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => dispatch(prepareUpdateCollection(collection))}>
                      <PencilIcon strokeWidth={2} className="h-5 w-5" />
                    </Button>

                    <Button size="small" variant="outlined" className="text-red-500 border-red-500" onClick={() => dispatch(prepareRemoveCollection(collection))}>
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
                <Pagination total={fetchCollectionsOperation.payload?.total || 0}
                  count={fetchCollectionsOperation.payload?.count || 0}
                  offset={fetchCollectionsOperation.payload?.offset || 0}
                  limit={fetchCollectionsOperation.payload?.limit || 0}
                  onPage={
                    (page: number, limit: number) => {
                      dispatch(fetchCollections({ skip: (page - 1) * limit, top: limit, orderby: 'seq desc, createdAt DESC' }))
                    }
                  } />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <dialog.FormDialog open={updateCollectionOperation.status === 'confirm' || createCollectionOperation.status === 'confirm'}
      okText={editOrCreateDialogConfirmButtonLabel()}
      title={editOrCreateDialogTitle()}
      cancel={closeEditOrCreateDialog}
      submit={collectionForm.handleSubmit(onSubmit)
      }>
      <div className="space-y-4">
        <Controller
          name="name"
          control={collectionForm.control}
          render={({ field }) => <div><TextField {...field} label="オリパ名" size="small" /></div>}
        />
        <Controller
          name="description"
          control={collectionForm.control}
          render={({ field }) => <div><TextField {...field} label="説明" size="small" /></div>}
        />
        <Controller
          name="seq"
          control={collectionForm.control}
          render={({ field }) => <div><TextField {...field} label="順番" type="number" size="small" /></div>}
        />
        <Controller
          name="thumbnail"
          control={collectionForm.control}
          render={({ field }) => <div>
            <span>画像</span>
            <FileUploader onUploaded={(url) => { collectionForm.setValue('thumbnail', url) }} />
            <img src={field.value} className="h-20 object-cover" />
            <input type="hidden" {...field} />
          </div>}
        />
        <Controller
          name="background"
          control={collectionForm.control}
          render={({ field }) => <div>
            <span>背景画像</span>
            <FileUploader onUploaded={(url) => { collectionForm.setValue('background', url) }} />
            <img src={field.value} className="h-20 object-cover" />
            <input type="hidden" {...field} />
          </div>}
        />
        <Controller
          name="subImages"
          control={collectionForm.control}
          render={({ field }) => <div>
            <span>サブ画像</span>
            <FileUploader onUploaded={(url) => { collectionForm.setValue('subImages', url) }} />
            <img src={field.value} className="h-20 object-cover" />
            <input type="hidden" {...field} />
          </div>}
        />
        <Controller
          name="gacha1Points"
          control={collectionForm.control}
          render={({ field }) => <div><TextField {...field} label="一回ガチャ所要ポイント" type="number" size="small" /></div>}
        />
        <Controller
          name="gacha10Points"
          control={collectionForm.control}
          render={({ field }) => <div ><TextField {...field} label="十連ガチャ所要ポイント" type="number" size="small" /></div>}
        />
        <Controller
          name="categoryId"
          control={collectionForm.control}
          render={({ field }) =>  <><span>カテゴリー</span> <Select size="small" {...field} >
          {fetchCategoriesOperation.payload?.data.map((category, index) => <MenuItem key={index} value={category.id}>{category.name}</MenuItem>)}
          </Select><br /></>} />
        <Controller
          name="pickup"
          control={collectionForm.control}
          render={({ field }) => <>
          <FormControlLabel control={<Switch checked={field.value} onChange={field.onChange} size="small" />} label="おすすめに設定" />
          <br />
          </>}
        />
        <Controller
          name="status"
          control={collectionForm.control}
          render={({ field }) => <>
          <FormControlLabel control={<Switch checked={field.value} onChange={field.onChange}  size="small" />} label="ステータス" />
          <br />
          </>}
        />
      </div>
    </dialog.FormDialog>
    <dialog.ConfirmDialog
      title="オリパ削除の確認"
      shouldOpen={removeCollectionOperation.status === 'confirm'} 
      confirm={() => {
        if (!removeCollectionOperation.payload) {
          alert("コレクトが選択されていません。");
          return;
        }
        dispatch(removeCollection(removeCollectionOperation.payload.id)).finally(() => {
          dispatch(fetchCollections({
            orderby: 'seq desc, createdAt desc'
          }));
          setTimeout(() => {
            dispatch(clearRemoveCollection());
          }, 300);
        })
      }}
      cancel={
        () => dispatch(clearRemoveCollection())
      }
    >
      {removeCollectionOperation.payload && removeCollectionOperation.payload.name}を削除しますか？
    </dialog.ConfirmDialog>
  </>
}