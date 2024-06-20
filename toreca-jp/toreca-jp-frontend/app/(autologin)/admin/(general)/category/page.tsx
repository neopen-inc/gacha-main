"use client"

import { notification } from "@commons";
import { StatusTag } from "@toreca-jp-app/components/admin/status-tag";
import { dialog } from "@commons";
import { Pagination } from "@toreca-jp-app/components/common/pagination";
import { SimpleBreadcrumb } from "@toreca-jp-app/components/common/simple-breadcrumb";
import { IconDelete } from "@toreca-jp-app/components/icons/delete";
import { IconPencil } from "@toreca-jp-app/components/icons/pencil";
import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks";
import { FormControlLabel, Switch, TextField } from "@mui/material";
import _ from "lodash";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { clearCreateCategory, clearRemoveCategory, clearUpdateCategory, createCategory, fetchCategories, prepareCreateCategory, prepareRemoveCategory, prepareUpdateCategory, removeCategoryById, updateCategoryById } from "@toreca-jp-app/domain/oripa/action";
import { PostCategoryDto } from "@toreca-jp-app/domain/oripa/dto";
import { PrimaryButton } from "@commons/components/buttons/primary-button";
import FileUploader from "@toreca-jp-app/components/common/file-uploader";

type CategoryForm = Omit<PostCategoryDto, 'status'> & { status: boolean };
export default function AdminCategoryPage() {
  const dispatch = useAppDispatch();
  const fetchCategoriesOperation = useAppSelector(state => state.oripa.operations.fetchCategories);
  const updateCategoryOperation = useAppSelector(state => state.oripa.operations.updateCategory);
  const createCategoryOperation = useAppSelector(state => state.oripa.operations.createCategory);
  const removeCategoryOperation = useAppSelector(state => state.oripa.operations.removeCategory);
  useEffect(() => {
    dispatch(fetchCategories({}));
  }, []);
  const defaultCategoryFormValues: CategoryForm = useMemo(() => {
    return updateCategoryOperation.payload ? {
      ..._.omit(updateCategoryOperation.payload, 'id'),
      status: updateCategoryOperation.payload.status === 'active'
    } : {
    name: '',
    description: '',
    thumbnail: '', 
    logo: '',
    seq: 0,
    status: false,
  }}, [updateCategoryOperation])
  const categoryForm = useForm({
    defaultValues: defaultCategoryFormValues
  });
  useEffect(() => {
    categoryForm.reset(defaultCategoryFormValues);
  }, [categoryForm, defaultCategoryFormValues]);
  
  const cancelRemoveCategory = () => {
    dispatch(clearRemoveCategory());
  }
  const confirmRemoveCategory = () => {
    if (!removeCategoryOperation.payload) {
      return;
    }
    dispatch(removeCategoryById(removeCategoryOperation.payload.id)).unwrap().then(() => {
      dispatch(notification.showNotification({
        message: 'カテゴリーを削除しました。',
        severity: 'success',
        }));
    }).catch(() => {
      dispatch(notification.showNotification({
        message: 'カテゴリーの削除が失敗しました。',
        severity: 'error',
        }));
    }).finally(() => {
      dispatch(fetchCategories({}));
      dispatch(clearRemoveCategory());
    });
  }
  const onSubmit = (data: CategoryForm) => {
    if (updateCategoryOperation.status === 'confirm' && updateCategoryOperation.payload) {
      dispatch(updateCategoryById({ id: updateCategoryOperation.payload.id, 
        category: { name: data.name,
          description: data.description,
          seq: data.seq,
          thumbnail: data.thumbnail, 
          logo: data.logo,  status: data.status ? 'active' : 'inactive' } })).unwrap().then(() => {
          dispatch(notification.showNotification({
            message: 'カテゴリーを更新しました。',
            severity: 'success',
          }));
        }).catch(() => {
          dispatch(notification.showNotification({
            message: 'カテゴリーの更新が失敗しました。',
            severity: 'error',
          }));
        }).finally(() => {
          dispatch(fetchCategories({}));
          dispatch(clearUpdateCategory());
        });
    }
    if (createCategoryOperation.status === 'confirm') {
      dispatch(createCategory({
        name: data.name,
        description: data.description,
        status: data.status ? 'active' : 'inactive',
        seq: data.seq,
        thumbnail: data.thumbnail, 
        logo: data.logo,
      })).unwrap().then(() => {
        dispatch(notification.showNotification({
          message: 'カテゴリーを作成しました。',
          severity: 'success',
        }));
      }).catch(() => {
        dispatch(notification.showNotification({
          message: 'カテゴリーの作成が失敗しました。',
          severity: 'error',
        }));
      }).finally(() => {
        dispatch(fetchCategories({}));
        dispatch(clearCreateCategory());
      })
    }
  }
  
  const closeEditOrCreateDialog = () => {
    if (updateCategoryOperation.status === 'confirm') {
      dispatch(clearUpdateCategory());
    }
    if (createCategoryOperation.status === 'confirm') {
      dispatch(clearCreateCategory());
    }
  }
  const editOrCreateDialogTitle = (): string => {
    if (updateCategoryOperation.status === 'confirm') {
      return 'カテゴリー編集';
    }
    if (createCategoryOperation.status === 'confirm') {
      return 'カテゴリー作成';
    }
    return '';
  }
  const editOrCreateDialogConfirmButtonLabel = (): string => {
    if (updateCategoryOperation.status === 'confirm') {
      return '更新';
    }
    if (createCategoryOperation.status === 'confirm') {
      return '作成';
    }
    return '';
  }
  return <>
    <div className="flex justify-between px-4 mt-4 sm:px-8">
      <h2 className="text-2xl text-gray-600">カテゴリー</h2>
      <SimpleBreadcrumb locations={[{ label: 'admin', link: '#' }, { label: 'カテゴリー', link: '/admin/category' }]} />
    </div>

    <div className="p-4 mt-8 sm:px-8 sm:py-4">
      <div className="p-4 bg-white rounded">
        <div className="flex justify-between">
          <PrimaryButton  onClick={() => {dispatch(prepareCreateCategory())}} >新規作成</PrimaryButton>
        </div>
        <table className="w-full mt-2 text-gray-500">
          <thead className="border-b">
            <tr>
              <th className="text-left text-gray-600">カテゴリー</th>
              <th className="text-left text-gray-600">ステータス</th>
              <th className="text-right text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fetchCategoriesOperation.payload?.data.map((category, index) => <tr key={index} className="cursor-pointer hover:bg-slate-100">

              <td className="flex items-center py-4">
                {category.name}
              </td>
              <td>
                <StatusTag status={category.status} />
              </td>
              <td className="text-right">
                <div className="flex justify-end">
                  <a onClick={() => dispatch(prepareUpdateCategory(category))}>
                    <IconPencil />
                  </a>
                  <a onClick={() => dispatch(prepareRemoveCategory(category))}>
                    <IconDelete />
                  </a>
                </div>
              </td>
            </tr>)}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>
                {fetchCategoriesOperation.payload && <Pagination total={fetchCategoriesOperation.payload?.total} count={fetchCategoriesOperation.payload?.count} offset={fetchCategoriesOperation.payload?.offset} limit={fetchCategoriesOperation.payload?.limit} onPage={function (page: number, limit: number): void {
                  dispatch(fetchCategories({ skip: (page - 1) * limit, top: limit, orderby: 'createdAt DESC' }))
                }} />}
              </td>
              
            </tr>
          </tfoot>
        </table >
      </div >
    </div >

    <dialog.FormDialog open={updateCategoryOperation.status === 'confirm' || createCategoryOperation.status === 'confirm'} 
      okText={editOrCreateDialogConfirmButtonLabel()}
      title={editOrCreateDialogTitle()} 
      cancel={closeEditOrCreateDialog}
      submit={categoryForm.handleSubmit(onSubmit)
      }>
      <div className="space-y-4">
        <Controller
          name="name"
          control={categoryForm.control}
          render={({ field }) => <div><TextField size="small" {...field} label="カテゴリー名" /></div>}
        />
        <Controller
          name="description"
          control={categoryForm.control}
          render={({ field }) => <div><TextField size="small" {...field} label="説明" /></div>}
        />
        <Controller
          name="seq"
          control={categoryForm.control}
          render={({ field }) => <div><TextField size="small" {...field} type="number" label="順番" /></div>}
        />
        <Controller
          name="thumbnail"
          control={categoryForm.control}
          render={({ field }) => <div>
            <span>サムネール</span>
            <FileUploader onUploaded={(url) => { categoryForm.setValue('thumbnail', url) }} />
            <img src={field.value} className="h-20 object-cover" />
            <input type="hidden" {...field} />
          </div>}
        />
        <Controller
          name="logo"
          control={categoryForm.control}
          render={({ field }) => <div>
            <span>ロゴ</span>
            <FileUploader onUploaded={(url) => { categoryForm.setValue('logo', url) }} />
            <img src={field.value} className="h-20 object-cover" />
            <input type="hidden" {...field} />
          </div>}
        />
        <Controller
          name="status"
          control={categoryForm.control}
          render={({ field }) => 
          <FormControlLabel control={<div><Switch size="small" checked={field.value} onChange={field.onChange} /></div>} label="表示" />
          }
        />
      </div>
    </dialog.FormDialog>
    <dialog.ConfirmDialog shouldOpen={removeCategoryOperation.status === 'confirm'}
     cancel={cancelRemoveCategory} 
     confirm={confirmRemoveCategory}
     title="カテゴリー削除"
    >
      {removeCategoryOperation.payload && removeCategoryOperation.payload.name}を削除しますか？
    </dialog.ConfirmDialog>
  </>
}
