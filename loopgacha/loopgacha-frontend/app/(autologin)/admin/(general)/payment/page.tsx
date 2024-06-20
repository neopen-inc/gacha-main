"use client"

import _ from "lodash";
import { Pagination } from "@loopgacha-app/components/common/pagination";
import { SimpleBreadcrumb } from "@loopgacha-app/components/common/simple-breadcrumb";
import { Payment, clearRemovePaymentById, fetchPayments, prepareRemovePaymentById, removePaymentById } from "@loopgacha-app/domain/payment";
import { useAppDispatch, useAppSelector } from "@loopgacha-app/store/hooks";
import React, { useEffect } from "react";
import { getJSTDatetimeString } from "@common-utils/lib/lib/date";
import { Button } from "@mui/material";
import { dialog } from "@commons";

export default function AdminPaymentPage() {
  const dispatch = useAppDispatch();
  const fetchPaymentsOperation = useAppSelector(state => state.payment.operations.fetchPayments);
  const removePaymentByIdOperaiton = useAppSelector(state => state.payment.operations.removePaymentById);
  useEffect(() => {
    dispatch(fetchPayments({orderby: 'createdAt DESC'}));
  }, []);
  const onPrepareDelete = (payment: Payment) => {
    dispatch(prepareRemovePaymentById(payment));
  }
  const cancelRemovePayment = () => {
    dispatch(clearRemovePaymentById());
  }
  const confirmRemovePayment = () => {
    if (!removePaymentByIdOperaiton.payload) {
      return ;
    }
    dispatch(removePaymentById(removePaymentByIdOperaiton.payload.id));
  }
  return <>
    <div className="flex justify-between px-4 mt-4 sm:px-8">
      <h2 className="text-2xl text-gray-600">支払い一覧</h2>
      <SimpleBreadcrumb locations={[{ label: 'admin', link: '#' }, { label: '支払い一覧', link: '/admin/payment' }]} />
    </div>

    <div className="p-4 mt-8 sm:px-8 sm:py-4">
      <div className="p-4 bg-white rounded">
        <div className="flex justify-between">
        </div>
        <table className="w-full mt-2 text-gray-500">
          <thead className="border-b">
            <tr>
              <th className="text-left text-gray-600">時間</th>
              <th className="text-left text-gray-600">パケッジ名</th>
              <th className="text-left text-gray-600">金額</th>
              <th className="text-left text-gray-600">ユーザー</th>
              <th className="text-left text-gray-600">ステータス</th>
              <th className="text-left text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fetchPaymentsOperation.payload?.data.map((payment, index) => <tr key={index} className="cursor-pointer hover:bg-slate-100">
            <td className=" items-center py-4">
                {getJSTDatetimeString(payment.createdAt)}
              </td>
              <td className=" items-center py-4">
                {payment.pointPackage?.name || '削除済みパケッジ'}
              </td>
              <td className=" items-center py-4">
                {payment.pointPackage?.price || '削除済みパケッジ'}
              </td>
              <td className=" items-center py-4">
                {payment.user.email}
              </td>

              <td className=" items-center py-4">
                {payment.status}
              </td>
              <td className=" items-center py-4">
                <Button onClick={() => onPrepareDelete(payment)}>詳細</Button>
              </td>
            </tr>)}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={7} className="py-2">
              <Pagination total={fetchPaymentsOperation.payload?.total || 0}
                count={fetchPaymentsOperation.payload?.count || 0}
                offset={fetchPaymentsOperation.payload?.offset || 0}
                limit={fetchPaymentsOperation.payload?.limit || 0}
                onPage={
                  (page: number, limit: number) => {
                    dispatch(fetchPayments({ skip: (page - 1) * limit, top: limit, orderby: 'createdAt DESC' }))
                  }
                } />
              </td>
            </tr>
          </tfoot>
        </table >
      </div >
      <dialog.ConfirmDialog 
        title="支払い記録を削除" 
        shouldOpen={removePaymentByIdOperaiton.status === 'confirm'}
        cancel={cancelRemovePayment}
        confirm={confirmRemovePayment}
      >
        {removePaymentByIdOperaiton?.payload?.id}を削除しますか？
      </dialog.ConfirmDialog>
    </div >
  </>
}
