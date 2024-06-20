"use client"

import { StatusTag } from "@toreca-jp-app/components/admin/status-tag";
import { SimpleBreadcrumb } from "@toreca-jp-app/components/common/simple-breadcrumb";
import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { ArchiveBoxXMarkIcon, DocumentTextIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Pagination } from "@toreca-jp-app/components/common/pagination";
import { Controller, useForm } from "react-hook-form";
import _ from "lodash";
import FileUploader from "@toreca-jp-app/components/common/file-uploader";
import { Collection } from "@toreca-jp-app/domain/oripa/types/collection";
import { clearCreateCollection, clearRemoveCollection, clearUpdateCollection, createCollection, fetchCollections, prepareCreateCollection, prepareRemoveCollection, prepareUpdateCollection, removeCollection, updateCollection } from "@toreca-jp-app/domain/oripa/action/collection.action";
import { fetchCategories } from "@toreca-jp-app/domain/oripa/action/category.action";
import { Button, TextField, Switch, FormControlLabel, Select, MenuItem } from "@mui/material";
import { dialog } from "@commons";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

type CollectionForm = Omit<Collection, 'id' | 'status'> & { status: boolean };
export default function AdminCollectionDetailPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchCategories({}));
    dispatch(fetchCollections({
      orderby: 'seq asc, createdAt desc'
    }));
  }, []);

  

  const categories = useAppSelector(state => state.oripa.operations.fetchCategories.payload);
  const collections = useAppSelector(state => state.oripa.operations.fetchCollections.payload);
  const updateCollectionOperation = useAppSelector(state => state.oripa.operations.updateCollection);
  const createCollectionOperation = useAppSelector(state => state.oripa.operations.createCollection);
  const removeCollectionOperation = useAppSelector(state => state.oripa.operations.removeCollection);

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
        collection: { ...data, status: data.status ? 'active' : 'inactive' }
      })).finally(() => {
        dispatch(fetchCollections({
          orderby: 'seq asc, createdAt desc'
        }));
        setTimeout(() => {
          
        }, 5000);
      })
    }
    if (createCollectionOperation.status === 'confirm') {
      dispatch(createCollection({
        ...data,
        status: data.status ? 'active' : 'inactive',
      })).finally(() => {
        dispatch(fetchCollections({
          orderby: 'seq asc, createdAt desc'
        }));
        setTimeout(() => {
          //dispatch(clearOperationStatus('createCollection'));
        }, 5000);
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
              <th className="text-right text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {collections?.data.map((collection, index) =>
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
                <td className="text-right">
                  <div className="flex justify-end space-x-5">
                    <Button  variant="outlined" color="primary" onClick={() => router.push(`/admin/collection/${collection.id}`)}>
                      <DocumentTextIcon strokeWidth={2} className="h-5 w-5" />
                    </Button>
                    <Button variant="outlined" color="primary" onClick={() => dispatch(prepareUpdateCollection(collection))}>
                      <PencilIcon strokeWidth={2} className="h-5 w-5" />
                    </Button>
                    <Button variant="outlined" color="primary" onClick={() => dispatch(prepareRemoveCollection(collection))}>
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
               { collections &&
                <Pagination total={collections.total}
                  count={collections.count}
                  offset={collections.offset}
                  limit={collections.limit}
                  onPage={
                    (page: number, limit: number) => {
                      dispatch(fetchCollections({ skip: (page - 1) * limit, top: limit, orderby: 'createdAt DESC' }))
                    }
                  } />
                }
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
          render={({ field }) => <TextField {...field} fullWidth size="small" label="オリパ名" />}
        />
        <Controller
          name="description"
          control={collectionForm.control}
          render={({ field }) => <TextField {...field} fullWidth size="small" placeholder="説明" />}
        />
        <Controller
          name="seq"
          control={collectionForm.control}
          render={({ field }) => <TextField fullWidth label="順番" size="small" type="number" {...field} />}
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
          name="subImages"
          control={collectionForm.control}
          render={({ field }) => <div>
            <span>詳細ページ画像</span>
            <FileUploader onUploaded={(url) => { collectionForm.setValue('subImages', url) }} />
            <img src={field.value} className="h-20 object-cover" />
            <input type="hidden" {...field} />
          </div>}
        />
        
        <Controller
          name="gacha1Points"
          control={collectionForm.control}
          render={({ field }) => <TextField fullWidth {...field} size="small" label="一回ガチャ所要ポイント" />}
        />
        <Controller
          name="gacha10Points"
          control={collectionForm.control}
          render={({ field }) => <TextField fullWidth {...field} size="small" label="十連ガチャ所要ポイント" />}
        />
        {categories?.data ? <Controller
          name="categoryId"
          control={collectionForm.control}
          render={({ field }) => <Select fullWidth size='small' {...field} >
            {categories?.data.map((category, index) => <MenuItem key={index} value={category.id}>{category.name}</MenuItem>)}
          </Select>}
        /> : <></>}
        <Controller
          name="status"
          control={collectionForm.control}
          render={({ field }) => <FormControlLabel control={<Switch checked={field.value} onChange={field.onChange} />} label="ステータス" />}
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

/**
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
 */