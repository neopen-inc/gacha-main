'use client'
import { dialog } from "@commons";
import { PrimaryButton } from "@commons/components/buttons/primary-button";
import { updateShipping } from "@nanashinooripa-app/domain/shipping/action";
import { clearUpdateShipping, fetchShippingById, prepareUpdateShipping } from "@nanashinooripa-app/domain/shipping/action/shipping.action";
import { useAppDispatch, useAppSelector } from "@nanashinooripa-app/store/hooks";
import { Button, Chip, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

export default function ShippingDetail({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const updateShippingOperation = useAppSelector(state => state.shipping.operations.updateShipping);
  const fetchShippingByIdOperation = useAppSelector(state => state.shipping.operations.fetchShippingById);
  React.useEffect(() => {
    dispatch(fetchShippingById(params.id)).unwrap().then((res) => {});
  }, []);
  return <div className="p-10">
    <PrimaryButton onClick={() => {
      if (!fetchShippingByIdOperation.payload) {
        throw new Error('shipping is not defined');
      }
      dispatch(prepareUpdateShipping(fetchShippingByIdOperation.payload))
    }}>発送</PrimaryButton>
  <div className="px-4 sm:px-0 mt-5">
    <h3 className="text-base font-semibold leading-7 text-gray-900">発送情報</h3>
    <div className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">注文ID：{fetchShippingByIdOperation.payload?.id}</div>
    <div className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">発送状態：</div>
    {fetchShippingByIdOperation.payload?.status === 'waiting' ? <Chip size="small" className="w-24 text-center" label="発送待ち" /> : <Chip size="small"  className="w-24 text-center" label="発送済み" /> }
  </div>
  
  <div className="mt-6 border-t border-gray-100">
    <dl className="divide-y divide-gray-100">
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">ユーザメール</dt>
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{fetchShippingByIdOperation.payload?.user?.email}</dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">郵便番号</dt>
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{!!fetchShippingByIdOperation.payload?.addressInfo && JSON.parse(fetchShippingByIdOperation.payload?.addressInfo).postcode}</dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">宛先</dt>
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{!!fetchShippingByIdOperation.payload?.addressInfo && JSON.parse(fetchShippingByIdOperation.payload?.addressInfo).name}</dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">郵送先</dt>
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{!!fetchShippingByIdOperation.payload?.addressInfo && JSON.parse(fetchShippingByIdOperation.payload?.addressInfo).addressline1 + JSON.parse(fetchShippingByIdOperation.payload?.addressInfo).addressline2 + JSON.parse(fetchShippingByIdOperation.payload?.addressInfo).addressline3}</dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">郵送番号</dt>
        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{!!fetchShippingByIdOperation.payload && fetchShippingByIdOperation.payload.trackingNumber}</dd>
      </div>
      <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
        <dt className="text-sm font-medium leading-6 text-gray-900">カード</dt>
        <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
          <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
            {
            fetchShippingByIdOperation.payload?.lineItems.map((lineItem, index) => 
              <li key={index} className="flex flex-row items-center justify-start py-4 pl-4 pr-5 text-sm leading-6">
              <div className="flex flex-col w-0 flex-1">
                <img className="w-24 flex-shrink-0 text-gray-400" src={lineItem.card.thumbnail} />
                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                  <span className="truncate font-medium">{lineItem.card.name}</span>
                </div>
              </div>
            </li>)
            }
          </ul>
        </dd>
      </div>
    </dl>
  </div>
  <dialog.FormDialog open={updateShippingOperation.status === 'confirm'} cancel={
    () => dispatch(clearUpdateShipping())
  } title={"発送"} submit={
    (event) => {
      event.preventDefault();
      if (!updateShippingOperation.payload) {
        throw new Error();
      }
      dispatch(updateShipping({
        shippingId: updateShippingOperation.payload.id, 
        patchShippingDto: {
          trackingNumber: (event.target as any).trackingNumber.value,
          status: 'shipped'
        }})).then(() => router.push('/admin/shipping'));
    }
  }>
      <div>
        <TextField name="trackingNumber" label="追跡番号(任意)" />
      </div>
      
  </dialog.FormDialog>
</div>
}