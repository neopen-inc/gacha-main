'use client';

import { StatusTag } from '@gacha-expo-app/components/admin/status-tag';
import { BaseDialog } from '@gacha-expo-app/components/dialog/base-dialog';
import { FormLineItem } from '@gacha-expo-app/components/form/form-line-item';
import { IconBlock } from '@gacha-expo-app/components/icons/block';
import { IconDown } from '@gacha-expo-app/components/icons/down';
import { IconHeartPlus } from '@gacha-expo-app/components/icons/heart-plus';
import { useAppDispatch, useAppSelector } from '@gacha-expo-app/store/hooks';
import { Menu } from '@headlessui/react';
import React from 'react';
import { useEffect } from 'react';
import { getJSTDateString } from '@gacha-expo-app/util/date';
import { Pagination } from '@gacha-expo-app/components/common/pagination';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import {
  clearPrepareRemoveUsers,
  fetchUsers,
  prepareRemoveUsers,
  removeUsers,
} from '@gacha-expo-app/domain/user/action/user.action';
import {
  clearCreatePointTransaction,
  createPointTransaction,
  prepareCreatePointTransaction,
} from '@gacha-expo-app/domain/point/action/point-transaction.action';
import { SimpleBreadcrumb } from '@gacha-expo-app/components/common/simple-breadcrumb';
import { PrimaryButton } from '@commons/components/buttons/primary-button';

export default function AdminUserPage() {
  const [openPointDialog, setOpenPointDialog] = React.useState(false);

  const createPointTransactionOperation = useAppSelector(
    (state) => state.point.operation.createPointTransaction
  );
  const dispatch = useAppDispatch();
  const userListResult = useAppSelector((state) => state.user.userListResult);
  const removeUserOperation = useAppSelector(
    (state) => state.user.operations.removeUser
  );
  const user = useAppSelector((state) => state.user.user.user);
  const [userKeyword, setUserKeyword] = React.useState('');
  useEffect(() => {
    dispatch(fetchUsers({ orderby: 'createdAt desc' }));
  }, [dispatch]);

  return (
    <>
      <div className="flex justify-between px-4 mt-4 sm:px-8">
        <h2 className="text-2xl text-gray-600">ユーザ管理</h2>
        <SimpleBreadcrumb
          locations={[
            { label: 'admin', link: '#' },
            { label: 'ユーザー管理', link: '/admin/user' },
          ]}
        />
      </div>

      <div className="p-4 mt-8 sm:px-8 sm:py-4">
        <div className="p-4 bg-white rounded">
          <div className="flex justify-between">
            <div className="flex justify-start gap-10 mb-10">
              <TextField
                type="text"
                name="keyword"
                label="ユーザー検索"
                size="small"
                onChange={(event) => {
                  setUserKeyword(event.target.value);
                }}
              />
              <Button
                onClick={() => {
                  dispatch(
                    fetchUsers({
                      email: userKeyword,
                      orderby: 'createdAt desc',
                    })
                  );
                }}
                variant="contained"
              >
                検索
              </Button>
            </div>
          </div>
          <table className="w-full mt-2 text-gray-500">
            <thead className="border-b">
              <tr>
                <th className="text-left text-gray-600">ユーザー</th>
                <th className="text-left text-gray-600">ステータス</th>
                <th className="text-left text-gray-600">ポイント数</th>
                <th className="text-left text-gray-600">アカウント作成日</th>
                <th className="text-right text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userListResult.data.map((user, index) => (
                <tr key={index}>
                  <td className="flex items-center py-4">
                    <div className="px-4">
                      <div>
                        <a href="#" className="text-gray-600 font-bolder">
                          {user.name}
                        </a>
                      </div>
                      <div className="font-bold text-sm">{user.email}</div>
                    </div>
                  </td>
                  <td>
                    <StatusTag status={user.status} />
                  </td>
                  <td>{user.points}</td>
                  <td>{getJSTDateString(user.createdAt)}</td>
                  <td className="text-right">
                    <Menu as="div" className="relative inline-block text-left">
                      <div>
                        <Menu.Button
                          className="
                  inline-flex
                  justify-center
                  w-full
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  rounded-md
                  bg-gray-500
                  hover:bg-gray-600
                  focus:outline-none
                  focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75
                "
                        >
                          操作
                          <IconDown />
                        </Menu.Button>
                      </div>

                      <Menu.Items
                        className="
                  absolute
                  right-0
                  w-32
                  mt-1
                  origin-top-right
                  bg-white
                  divide-y divide-gray-100
                  rounded-md
                  shadow-lg
                  ring-1 ring-black ring-opacity-5
                  z-50
                  focus:outline-none
                "
                      >
                        <div className="px-1 py-1">
                          <Menu.Item v-slot="{ active }">
                            <Button
                              className="text-gray-900 group flex rounded-md items-center w-full px-2 py-2 text-sm"
                              onClick={() => {
                                dispatch(
                                  prepareCreatePointTransaction(user.id)
                                );
                              }}
                            >
                              <IconHeartPlus />
                              ポイント付与
                            </Button>
                          </Menu.Item>
                          <Menu.Item v-slot="{ active }">
                            <Button
                              className="text-gray-900 group flex rounded-md items-center w-full px-2 py-2 text-sm"
                              onClick={() => {
                                dispatch(prepareRemoveUsers(user));
                              }}
                            >
                              <IconBlock />
                              削除
                            </Button>
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={7} className="py-2">
                  <Pagination
                    total={userListResult.total}
                    count={userListResult.count}
                    offset={userListResult.offset}
                    limit={userListResult.limit}
                    onPage={function (page: number, limit: number): void {
                      dispatch(
                        fetchUsers({
                          top: limit,
                          skip: (page - 1) * limit,
                          orderby: 'createdAt desc',
                        })
                      );
                    }}
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <Dialog
        open={createPointTransactionOperation.status === 'confirm'}
        onClose={() => setOpenPointDialog(false)}
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!createPointTransactionOperation.payload) {
              return;
            }
            dispatch(
              createPointTransaction({
                userId: createPointTransactionOperation.payload,
                postPointTransactionDto: {
                  type: 'admin',
                  amount: (event.target as any).amount.value,
                  reason: (event.target as any).reason.value,
                },
              })
            ).then(() => {
              setOpenPointDialog(false);
              dispatch(fetchUsers({ orderby: 'createdAt desc' }));
            });
          }}
        >
          <DialogTitle>ポイント付与</DialogTitle>
          <DialogContent>
            <TextField type="number" name="amount" label="ポイント数" />
            <br />
            <TextField type="text" name="reason" label="説明" />
          </DialogContent>
          <DialogActions>
            <Button
              variant="text"
              onClick={() => dispatch(clearCreatePointTransaction())}
              className="mr-1"
            >
              <span>キャンセル</span>
            </Button>
            <PrimaryButton type="submit">作成</PrimaryButton>
          </DialogActions>
        </form>
      </Dialog>
      <BaseDialog
        isOpen={openPointDialog}
        title={'ポイント付与'}
        content={
          <div className="flex justify-between py-10">
            <FormLineItem
              name={'point'}
              type={'number'}
              label={'ポイント数'}
              required={false}
            />
          </div>
        }
        confirmLabel={'確認'}
        cancelLabel={'キャンセル'}
        onConfirm={function (): void {
          setOpenPointDialog(false);
        }}
        onCancel={function (): void {
          setOpenPointDialog(false);
        }}
        color={'red'}
      />
      <BaseDialog
        isOpen={removeUserOperation.status === 'confirm'}
        title={'ユーザー削除'}
        content={`ユーザー${removeUserOperation.payload?.email}を削除してもよろしいでしょうか？`}
        confirmLabel={'確認'}
        cancelLabel={'キャンセル'}
        onConfirm={function (): void {
          if (!removeUserOperation.payload) {
            return;
          }
          dispatch(removeUsers(removeUserOperation.payload.id)).then(() => {
            dispatch(fetchUsers({ orderby: 'createdAt desc' }));
          });
        }}
        onCancel={function (): void {
          dispatch(clearPrepareRemoveUsers());
        }}
        color={'red'}
      />
    </>
  );
}
