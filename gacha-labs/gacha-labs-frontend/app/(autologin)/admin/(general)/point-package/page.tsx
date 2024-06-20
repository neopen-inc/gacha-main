"use client"

import { dialog, notification } from "@commons";
import { SimpleBreadcrumb } from "@gacha-labs-app/components/common/simple-breadcrumb";
import { IconDelete } from "@gacha-labs-app/components/icons/delete";
import { IconPencil } from "@gacha-labs-app/components/icons/pencil";
import { useAppDispatch, useAppSelector } from "@gacha-labs-app/store/hooks";
import { prepareCreatePointPackage, prepareRemovePointPackage, prepareUpdatePointPackage, createPointPackage, removePointPackage, fetchPointPackages, updatePointPackage, PointPackage, clearCreatePointPackage, clearUpdatePointPackage, clearRemovePointPackage } from "@gacha-labs-app/domain/point";
import { Button, TextField } from "@mui/material";
import _ from "lodash";
import React, { useEffect } from "react";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

export default function AdminPointPackagePage() {
  const dispatch = useAppDispatch();
  const createPointPackageOperation = useAppSelector(state => state.point.operation.createPointPackage);
  const updatePointPackageOperation = useAppSelector(state => state.point.operation.updatePointPackage);
  const removePointPackageOperation = useAppSelector(state => state.point.operation.removePointPackage);
  const fetchPointPackagesOperation = useAppSelector(state => state.point.operation.fetchPointPackages);
  
  const onClickRemovePointPackage = (pointPackage: PointPackage) => dispatch(prepareRemovePointPackage(pointPackage));
  const confirmRemovePointPackage = () => {
    if (!removePointPackageOperation?.payload?.id) {
      dispatch(clearRemovePointPackage())
      return;
    }
    dispatch(removePointPackage(removePointPackageOperation?.payload?.id)).then(() => {
      dispatch(fetchPointPackages({orderby: 'price ASC'}));
    }).then(() => {
      dispatch(clearRemovePointPackage())
    });
  }
  const cancelRemovePointPackage = () => {
    dispatch(clearRemovePointPackage());
  }
  useEffect(() => {
    dispatch(fetchPointPackages({orderby: 'price ASC'}));
  }, []);
  
  return <>
    <div className="flex justify-between px-4 mt-4 sm:px-8">
      <h2 className="text-2xl text-gray-600">購買パケッジ管理</h2>
      <SimpleBreadcrumb locations={[{ label: 'admin', link: '#' }, { label: '購買パケッジ管理', link: '/admin/point-package' }]} />
    </div>

    <div className="p-4 mt-8 sm:px-8 sm:py-4">
      <div className="p-4 bg-white rounded">
        <div className="flex justify-between">
          <PrimaryButton  onClick={() => {
            dispatch(prepareCreatePointPackage());
          }}>新規作成</PrimaryButton>
        </div>
        <table className="w-full mt-2 text-gray-500">
          <thead className="border-b">
            <tr>
              <th className="text-left text-gray-600">パケッジ名</th>
              <th className="text-left text-gray-600">説明</th>
              <th className="text-left text-gray-600">ポイント</th>
              <th className="text-left text-gray-600">金額</th>
              <th className="text-left text-gray-600">プロバイダーID</th>
              <th className="text-right text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fetchPointPackagesOperation.payload?.map((pointPackage, index) => <tr key={index} className="cursor-pointer hover:bg-slate-100">

              <td className=" items-center py-4">
                {pointPackage.name}
              </td>
              <td className=" items-center py-4">
                {pointPackage.description}
              </td>

              <td className=" items-center py-4">
                {pointPackage.points}
              </td>
              <td className=" items-center py-4">
                {pointPackage.price}
              </td>
              <td className=" items-center py-4">
                {pointPackage.providerPackageId}
              </td>

              <td className="text-right">
                <div className="flex justify-end">
                  <a onClick={() => dispatch(prepareUpdatePointPackage(pointPackage))}>
                    <IconPencil />
                  </a>
                  <a onClick={() => onClickRemovePointPackage(pointPackage)}>
                    <IconDelete />
                  </a>
                </div>
              </td>
            </tr>)}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} className="py-2">
              </td>
            </tr>
          </tfoot>
        </table >
      </div >
    </div >

    <dialog.FormDialog 
    open={createPointPackageOperation.status === 'confirm' || updatePointPackageOperation.status === 'confirm'} 
    title={`ポイントパケッジ${createPointPackageOperation.status === 'confirm' ? '作成' : '編集'}`} 
    cancel={() => {
      if (createPointPackageOperation.status === 'confirm') {
        dispatch(clearCreatePointPackage())
      }
      if (updatePointPackageOperation.status === 'confirm') {
        dispatch(clearUpdatePointPackage())
      }
    }}
      submit={(event) => {
        event.preventDefault();
        if (createPointPackageOperation.status === 'confirm') {
          dispatch(createPointPackage({
            name: (event.target as any).name.value,
            description: (event.target as any).description.value,
            points: (event.target as any).points.value,
            price: (event.target as any).price.value,
            providerPackageId: (event.target as any).providerPackageId.value,
          })
          ).then(() => {
            dispatch(notification.showNotification({
              severity: 'success',
              message: 'ポイントパケッジを作成しました。'
            }));
          }).catch(() => {
            dispatch(notification.showNotification({
              severity: 'error',
              message: 'ポイントパケッジを作成失敗しました。'
            }));
          }).finally(() => { 
            dispatch(clearCreatePointPackage());
            dispatch(fetchPointPackages({orderby: 'price ASC'}));
          });
        } else if (updatePointPackageOperation.status === 'confirm') {
          if (!updatePointPackageOperation.payload?.id) {
            return;
          }
          dispatch(updatePointPackage({
            id: updatePointPackageOperation.payload?.id,
            patchPointPackageDto: {
              name: (event.target as any).name.value,
              description: (event.target as any).description.value,
              points: (event.target as any).points.value,
              price: (event.target as any).price.value,
              providerPackageId: (event.target as any).providerPackageId.value,
            }
          })).unwrap().then(() => {
            dispatch(notification.showNotification({
              severity: 'success',
              message: 'ポイントパケッジを更新しました。'
            }));
          }).catch(() => {
            dispatch(notification.showNotification({
              severity: 'error',
              message: 'ポイントパケッジを更新失敗しました。'
            }));
          }).finally(() => { 
            dispatch(clearUpdatePointPackage());
            dispatch(fetchPointPackages({orderby: 'price ASC'}));
          });
        }
      }
      }>
      <div className="space-y-4">
        <div>
        <TextField name="name" label="パケッジ名" size="small" defaultValue={updatePointPackageOperation.status === 'confirm' ? updatePointPackageOperation.payload?.name : ''} />
        </div>
        <div>
        <TextField name="description" label="説明" size="small" defaultValue={updatePointPackageOperation.status === 'confirm' ? updatePointPackageOperation.payload?.description : ''} />
        </div>
        <div>
        <TextField name="points" label="購入ポイント"  defaultValue={updatePointPackageOperation.status === 'confirm' ? updatePointPackageOperation.payload?.points : ''} />
        </div>
        <div>
        <TextField name="price" label="支払い金額" size="small" defaultValue={updatePointPackageOperation.status === 'confirm' ? updatePointPackageOperation.payload?.price : ''} />
        </div>
        <div>
        <TextField name="providerPackageId" label="stripe ID" size="small" defaultValue={updatePointPackageOperation.status === 'confirm' ? updatePointPackageOperation.payload?.providerPackageId : ''} />
        </div>
      </div>
    </dialog.FormDialog>
    <dialog.ConfirmDialog 
      title="パケッジ削除" 
      shouldOpen={removePointPackageOperation.status === 'confirm'}
      cancel={cancelRemovePointPackage}
      confirm={confirmRemovePointPackage}
    >
      {removePointPackageOperation?.payload?.name}を削除しますか？
    </dialog.ConfirmDialog>
  </>
}