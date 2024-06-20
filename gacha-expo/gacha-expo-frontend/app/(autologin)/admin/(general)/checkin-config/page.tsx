"use client"

import { notification } from "@commons";
import { dialog } from "@commons";
import { SimpleBreadcrumb } from "@gacha-expo-app/components/common/simple-breadcrumb";
import { IconDelete } from "@gacha-expo-app/components/icons/delete";
import { IconPencil } from "@gacha-expo-app/components/icons/pencil";
import { CheckinConfig, removeCheckinConfig } from "@gacha-expo-app/domain/user";
import { useAppDispatch, useAppSelector } from "@gacha-expo-app/store/hooks";
import { clearOperationStatus, confirmCreateCheckinConfig, confirmDeleteCheckinConfig, confirmUpdateCheckinConfig, createCheckinConfig, fetchCheckinConfigs, getCheckinConfigs, updateCheckinConfig } from "@gacha-expo-app/domain/user";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch, TextField } from "@mui/material";
import _, { sortBy } from "lodash";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

type CheckinConfigForm = Omit<CheckinConfig, 'clearPoints' | 'id'> & { clearPoints: boolean};
export default function AdminCategoryPage() {
  const dispatch = useAppDispatch();
  const createCheckinConfigOperation = useAppSelector(state => state.user.operations.createCheckinConfig);
  const updateCheckinConfigOperation = useAppSelector(state => state.user.operations.updateCheckinConfig);
  const deleteCheckinConfigOperation = useAppSelector(state => state.user.operations.deleteCheckinConfig);
  const fetchCheckinConfigsOperation = useAppSelector(state => state.user.operations.fetchCheckinConfigs);

  const createCategoryOperation = useAppSelector(state => state.oripa.operations.createCategory);
  useEffect(() => {
    dispatch(fetchCheckinConfigs());
  }, []);
  const defaultCheckinConfigFormValues: CheckinConfigForm = useMemo(() => {
    return updateCheckinConfigOperation.payload ? {
      ..._.omit(updateCheckinConfigOperation.payload, 'id'),
      clearPoints: updateCheckinConfigOperation.payload.clearPoints === 1,
    } : {
    days: 0,
    points: 0,
    clearPoints: false,
  }}, [updateCheckinConfigOperation])
  const checkinForm = useForm({
    defaultValues: defaultCheckinConfigFormValues
  });
  useEffect(() => {
    checkinForm.reset(defaultCheckinConfigFormValues);
  }, [checkinForm, defaultCheckinConfigFormValues]);
  const onSubmit = (data: CheckinConfigForm) => {
    if (updateCheckinConfigOperation.status === 'confirm' && updateCheckinConfigOperation.payload) {
      if (!updateCheckinConfigOperation?.payload?.id) {
        return ;
      }
      dispatch(updateCheckinConfig({ id: updateCheckinConfigOperation?.payload?.id, 
        config: {
          points: data.points,
          days: data.days,
          clearPoints: data.clearPoints ? 1 : 0,
        } })).unwrap().then(() => {
          dispatch(notification.showNotification({ severity: 'success', message: 'チェックインボーナスを更新しました。' }));
        }).catch(() => {
          dispatch(notification.showNotification({ severity: 'error', message: 'チェックインボーナスの更新に失敗しました。' }));
        }).finally(() => {
          dispatch(fetchCheckinConfigs());
          dispatch(clearOperationStatus('updateCheckinConfig'));
        })
    }
    if (createCheckinConfigOperation.status === 'confirm') {
      dispatch(createCheckinConfig({config: {
        points: data.points,
        days: data.days,
        clearPoints: data.clearPoints ? 1 : 0,
      }})).unwrap().then(() => {
        dispatch(notification.showNotification({ severity: 'success', message: 'チェックインボーナスを作成しました。' }));
      }).catch(() => {
        dispatch(notification.showNotification({ severity: 'error', message: 'チェックインボーナスの作成に失敗しました。' }));
      }).finally(() => {
        dispatch(fetchCheckinConfigs());
        dispatch(clearOperationStatus('createCheckinConfig'));
      })
    }
  }

  const closeEditOrCreateDialog = async () => {
    if (updateCheckinConfigOperation.status === 'confirm') {
      dispatch(clearOperationStatus('updateCheckinConfig'));
    }
    if (createCategoryOperation.status === 'confirm') {
      dispatch(clearOperationStatus('createCheckinConfig'));
    }
  }
  const editOrCreateDialogTitle = (): string => {
    if (updateCheckinConfigOperation.status === 'confirm') {
      return 'チェックインボーナス更新';
    }
    if (createCheckinConfigOperation.status === 'confirm') {
      return 'チェックインボーナス作成';
    }
    return '';
  }
  const editOrCreateDialogConfirmButtonLabel = (): string => {
    if (updateCheckinConfigOperation.status === 'confirm') {
      return '更新';
    }
    if (createCheckinConfigOperation.status === 'confirm') {
      return '作成';
    }
    return '';
  }
  
  return <>
    <div className="flex justify-between px-4 mt-4 sm:px-8">
      <h2 className="text-2xl text-gray-600">チェックイン</h2>
      <SimpleBreadcrumb locations={[{ label: 'admin', link: '#' }, { label: 'チェックイン', link: '/admin/checkin-config' }]} />
    </div>

    <div className="p-4 mt-8 sm:px-8 sm:py-4">
      <div className="p-4 bg-white rounded">
        <div className="flex justify-between">
        <PrimaryButton onClick={() => {
                dispatch(confirmCreateCheckinConfig())
              }} >新規作成</PrimaryButton>
        </div>
        <table className="w-full mt-2 text-gray-500">
          <thead className="border-b">
            <tr>
              <th className="text-left text-gray-600">日数</th>
              <th className="text-left text-gray-600">ポイント</th>
              <th className="text-left text-gray-600">集計リセット</th>
              <th className="text-right text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortBy(fetchCheckinConfigsOperation.payload, 'days').map((checkinConfig, index) => <tr key={index} className="cursor-pointer hover:bg-slate-100">
              <td className="flex items-center py-4">
                {checkinConfig.days}
              </td>
              <td>
              {checkinConfig.points}
              </td>
              <td>
              {checkinConfig.clearPoints === 1 ?  <span className="px-2 py-1 rounded text-xs text-white bg-green-500">あり</span> : <span className="px-2 py-1 rounded text-xs text-white bg-red-500">なし</span>}
              </td>
              <td className="text-right">
                <div className="flex justify-end">
                  <a onClick={() => dispatch(confirmUpdateCheckinConfig(checkinConfig))}>
                    <IconPencil />
                  </a>
                  <a onClick={() => dispatch(confirmDeleteCheckinConfig(checkinConfig))}>
                    <IconDelete />
                  </a>
                </div>
              </td>
            </tr>)}
          </tbody>
          
        </table >
      </div >
    </div >

    <dialog.FormDialog open={createCheckinConfigOperation.status === 'confirm' || updateCheckinConfigOperation.status === 'confirm'} 
      okText={editOrCreateDialogConfirmButtonLabel()}
      title={editOrCreateDialogTitle()} 
      cancel={closeEditOrCreateDialog}
      submit={checkinForm.handleSubmit(onSubmit)
      }>
      <div className="space-y-4">
        <Controller
          name="days"
          control={checkinForm.control}
          render={({ field }) => <div><TextField label={"日数"} {...field} placeholder="日数" /></div>}
        />
        <Controller
          name="points"
          control={checkinForm.control}
          render={({ field }) => <div><TextField label={"ポイント"} {...field} placeholder="ポイント" /></div>}
        />
        <Controller
          name="clearPoints"
          control={checkinForm.control}
          render={({ field }) => <div><FormControlLabel label="集計をリセット" control={<Switch checked={field.value} onChange={field.onChange} />}  /></div> }
        />
      </div>
    </dialog.FormDialog>
    <Dialog open={deleteCheckinConfigOperation.status === 'confirm'} onClose={() => dispatch(clearOperationStatus('deleteCheckinConfig'))}>
      <DialogTitle>チェックインボーナス</DialogTitle>
      <DialogContent>
        {deleteCheckinConfigOperation.payload && deleteCheckinConfigOperation.payload.days}日ボーナス設定を削除しますか？
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          
          onClick={() => dispatch(clearOperationStatus('deleteCheckinConfig'))}
          className="mr-1"
        >
          <span>キャンセル</span>
        </Button>
        <PrimaryButton onClick={() => {
          if (!deleteCheckinConfigOperation.payload) {
            alert("チェックインボーナス設定が選択されていません。");
            return;
          }
          dispatch(removeCheckinConfig({ id: deleteCheckinConfigOperation.payload.id })).then(() => {
            dispatch(fetchCheckinConfigs());
            dispatch(clearOperationStatus('deleteCheckinConfig'));
          })
        }}>
          削除
        </PrimaryButton>
      </DialogActions>

    </Dialog>

  </>
}

/***
 * 
 
        (event) => {
        event.preventDefault();
        if (categoryEditMode === 'create') {
          dispatch(createCategory({
            name: (event.target as any).name.value,
            description: (event.target as any).description.value,
            status: 'active',
          })
          ).then(() => {
            setOpenCreateCategory(false);
            dispatch(getCategories({}))
          });
        } else if (categoryEditMode === 'edit') {
          if (!category?.id) {
            return;
          }
          dispatch(patchCategory({ id: category?.id, category: { name: (event.target as any).name.value, description: (event.target as any).description.value } })).then(() => {
            setOpenCreateCategory(false);
            dispatch(getCategories({}));
          })
        }
      }
 * 
 */