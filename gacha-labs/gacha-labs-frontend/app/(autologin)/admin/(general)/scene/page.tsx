"use client"

import { dialog, notification } from "@commons";
import FileUploader from "@gacha-labs-app/components/common/file-uploader";
import { SimpleBreadcrumb } from "@gacha-labs-app/components/common/simple-breadcrumb";
import { IconDelete } from "@gacha-labs-app/components/icons/delete";
import { PostSceneDto } from "@gacha-labs-app/domain/oripa/dto";
import { clearCreateScene, clearRemoveScene, createScene, fetchScenes, prepareCreateScene, prepareRemoveScene, removeScene } from "@gacha-labs-app/domain/oripa/action";
import { useAppDispatch, useAppSelector } from "@gacha-labs-app/store/hooks";
import { TextField } from "@mui/material";
import _, { sortBy } from "lodash";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

type SceneForm = PostSceneDto;
export default function AdminScenePage() {
  const dispatch = useAppDispatch();
  //const scenes = useAppSelector(state => state.oripa.scene.scenes);
  const updateSceneOperation = useAppSelector(state => state.oripa.operations.updateScene);
  const createSceneOperation = useAppSelector(state => state.oripa.operations.createScene);
  const removeSceneOperation = useAppSelector(state => state.oripa.operations.removeScene);
  const fetchScenesOperation = useAppSelector(state => state.oripa.operations.fetchScenes);
  useEffect(() => {
    dispatch(fetchScenes());
  }, []);
  const defaultSceneFormValues: SceneForm = useMemo(() => {
    return {
      grade: '',
      url: '',
    }
  }, [])
  const sceneForm = useForm({
    defaultValues: defaultSceneFormValues
  });
  useEffect(() => {
    sceneForm.reset(defaultSceneFormValues);
  }, [sceneForm, defaultSceneFormValues]);
  const onSubmit = (data: SceneForm) => {
    if (createSceneOperation.status === 'confirm') {
      dispatch(createScene({
        grade: data.grade,
        url: data.url,
      })).unwrap().then(() => {
        dispatch(notification.showNotification({
          severity: 'success',
          message: '演出作成しました。'
          }))
      }).catch(() => {
        dispatch(notification.showNotification({
          severity: 'error',
          message: '演出作成失敗しました。'
          }))
      }).finally(() => {
        dispatch(fetchScenes());
        dispatch(clearCreateScene());
      })
    }
  }

  const closeEditOrCreateDialog = async () => {
    if (updateSceneOperation.status === 'confirm') {
      //dispatch(clearOperationStatus('updateScene'));
    }
    if (createSceneOperation.status === 'confirm') {
      dispatch(clearCreateScene());
    }
  }
  const editOrCreateDialogTitle = (): string => {
    if (updateSceneOperation.status === 'confirm') {
      return '演出編集';
    }
    if (createSceneOperation.status === 'confirm') {
      return '演出作成';
    }
    return '';
  }
  const editOrCreateDialogConfirmButtonLabel = (): string => {
    if (updateSceneOperation.status === 'confirm') {
      return '更新';
    }
    if (createSceneOperation.status === 'confirm') {
      return '作成';
    }
    return '';
  }

  return <>
    <div className="flex justify-between px-4 mt-4 sm:px-8">
      <h2 className="text-2xl text-gray-600">演出</h2>
      <SimpleBreadcrumb locations={[{ label: 'admin', link: '#' }, { label: '演出', link: '/admin/scene' }]} />
    </div>

    <div className="p-4 mt-8 sm:px-8 sm:py-4">
      <div className="p-4 bg-white rounded">
        <div className="flex justify-start">
          <PrimaryButton onClick={() => {dispatch(prepareCreateScene())}} >新規作成</PrimaryButton>
        </div>
        <table className="w-full mt-2 text-gray-500">
          <thead className="border-b">
            <tr className="text-sm">
              <th className="text-left text-gray-600 w-16">グレード</th>
              <th className="text-left text-gray-600 ">URL</th>
              <th className="text-right text-gray-600 w-5">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortBy(fetchScenesOperation.payload, 'grade').map((scene, index) =>
              <tr key={index} className="cursor-pointer hover:bg-slate-100">
                <td className=" items-center w-10">{scene.grade}</td>
                <td className=" items-center">{scene.url}</td>
                <td className="text-right w-5">
                  <a onClick={() => dispatch(prepareRemoveScene(scene))}>
                    <IconDelete />
                  </a>
                </td>
              </tr>)
            }
          </tbody>
        </table>
      </div>
    </div>

    <dialog.FormDialog open={updateSceneOperation.status === 'confirm' || createSceneOperation.status === 'confirm'}
      okText={editOrCreateDialogConfirmButtonLabel()}
      title={editOrCreateDialogTitle()}
      cancel={closeEditOrCreateDialog}
      submit={sceneForm.handleSubmit(onSubmit)
      }>
      <div className="space-y-4">
        <Controller
          name="grade"
          control={sceneForm.control}
          render={({ field }) => <div><TextField {...field} label="グレード" size="small" /></div>
          }
        />

        <Controller
          name="url"
          control={sceneForm.control}
          render={({ field }) => <div>
            <span>演出(ファイルのサイズは20MBまで)</span>
            <FileUploader onUploaded={(url) => { sceneForm.setValue('url', url) }} />
            <video src={field.value} className="h-20 object-cover" />
            <input type="hidden" {...field} />
          </div>}
        />
      </div>
    </dialog.FormDialog>
    <dialog.ConfirmDialog 
      shouldOpen={removeSceneOperation.status === 'confirm'} 
      title="演出削除"
      cancel={() => dispatch(clearRemoveScene())}
      confirm={() => {
        if (!removeSceneOperation.payload) {
          alert("演出が選択されていません。");
          return;
        }
        dispatch(removeScene(removeSceneOperation.payload.id)).unwrap().then(() => {
          dispatch(notification.showNotification({
            severity: 'success',
            message: '演出削除しました。'
            }));
        }).catch(() => { 
          dispatch(notification.showNotification({
            severity: 'error',
            message: '演出削除失敗しました。'
            }));
        }).finally(() => {
          dispatch(fetchScenes());
          dispatch(clearRemoveScene());
        });
      }}
    >
      演出を削除しますか？
    </dialog.ConfirmDialog>
  </>
}
