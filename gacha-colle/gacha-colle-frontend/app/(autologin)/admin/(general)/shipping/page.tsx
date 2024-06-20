"use client"
export const dynamic = 'force-dynamic'

import { Pagination } from "@gacha-colle-app/components/common/pagination";
import { SimpleBreadcrumb } from "@gacha-colle-app/components/common/simple-breadcrumb";
import { fetchShippings } from "@gacha-colle-app/domain/shipping/action/shipping.action";
import { useAppDispatch, useAppSelector } from "@gacha-colle-app/store/hooks";
import { Chip } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";


export default function AdminShippingPage({ searchParams }: { searchParams: { status: string } }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParamHooks = useSearchParams();
  const fetchShippingsOperation = useAppSelector(state => state.shipping.operations.fetchShippings);

  const shippingStatus = (searchParams.status as ('waiting' | 'shipped')) || searchParamHooks.get('status') || 'waiting';
  React.useEffect(() => {
    dispatch(fetchShippings({ status: shippingStatus, orderby: 'createdAt desc' }));
  }, []);
  const shippings = useAppSelector(state => state.oripa.shippings);
  return <>
    <div className="flex justify-between px-4 mt-4 sm:px-8">
      <h2 className="text-2xl text-gray-600">発送管理</h2>
      <SimpleBreadcrumb locations={[{ label: 'admin', link: '#' }, { label: '発送管理', link: '/admin/shipping' }]} />
    </div>

    <div className="p-4 mt-8 sm:px-8 sm:py-4">
      <div className="p-4 bg-white rounded">
        <div className="flex justify-between">
        </div>
        <table className="w-full mt-2 text-gray-500 text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left text-gray-600">発送ID</th>
              <th className="text-left text-gray-600">発送請求日時</th>
              <th className="text-left text-gray-600">発送処理日時</th>
              <th className="text-left text-gray-600">ユーザー</th>
              <th className="text-left text-gray-600">ステータス</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fetchShippingsOperation.payload?.data.map((shipping, index) => <tr key={index} onClick={() => { router.push(`/admin/shipping/${shipping.id}`) }} className="cursor-pointer hover:bg-slate-100">
              <td className="flex items-center py-4">
                {shipping.id}
              </td>
              <td>
                {shipping.createdAt && new Date(shipping.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Tokyo' })}
              </td>
              <td>
                {shipping.updatedAt && new Date(shipping.updatedAt).toLocaleString('en-US', { timeZone: 'Asia/Tokyo' })}
              </td>
              <td>
                {shipping.user?.email}
              </td>
              <td>{shipping?.status === 'waiting' ? <Chip size="small" color="warning" label="発送待ち" className="w-24 text-center" /> : <Chip size="small" color="success" label="発送済み" className="w-24 text-center" />}</td>
            </tr>
            )
            }
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>
              <Pagination total={fetchShippingsOperation.payload?.total || 0} count={fetchShippingsOperation.payload?.count || 0} offset={fetchShippingsOperation.payload?.offset || 0} limit={fetchShippingsOperation.payload?.limit || 0} onPage={function (page: number, limit: number): void {
                dispatch(fetchShippings({ status: shippingStatus, skip: (page - 1) * limit, top: limit, orderby: 'createdAt DESC' }))
              }} />
              </td>
              
            </tr>
          </tfoot>
        </table >
      </div >
    </div >
  </>
}
