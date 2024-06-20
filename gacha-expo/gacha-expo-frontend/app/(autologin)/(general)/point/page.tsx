'use client'

import { PointPlanListItem } from "@gacha-expo-app/components/point/point-plan-list-item";
import { User } from "@gacha-expo-app/domain/user";
import { useAppDispatch, useAppSelector } from "@gacha-expo-app/store/hooks";
import { setPageTitle, setReturnPage } from "@gacha-expo-app/store/page";
import { createCheckoutSession, fetchPointPackages, PointPackage } from "@gacha-expo-app/domain/point";
import { numberUtils } from "@common-utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function PointPage() {
  const userInfo = useAppSelector(state => state.user.myInfo.userProfile);
  const fetchPointPackagesOperations = useAppSelector(state => state.point.operation.fetchPointPackages);
  const dispatch = useAppDispatch();
  const router = useRouter();

  function onPurchase(userInfo: User | undefined, pointPackage: PointPackage) {
    if (!userInfo) {
      router.push('/login');
      return;
    }
    dispatch(createCheckoutSession({
      userId: userInfo.id,
      pointPackageId: pointPackage.id
    })).unwrap().then((result) => {  window.location.href = result.url; });
  }
  useEffect(() => {
    dispatch(setPageTitle('ポイント購入'));
    dispatch(setReturnPage('/'));
    dispatch(fetchPointPackages({ orderby: 'price asc'}));
  }, [])
  return <div className="py-5">
    <div className="rounded mb-5">所持ポイント: {numberUtils.formatNumberToLocaleString(userInfo?.points)} points</div>
    <div className="bg-gray-200 p-4 ">
      <span className="text-gray-500">銀行振込の場合はポイントの反映までお時間を頂戴いたします。お急ぎの場合はカード決済等をご利用くださいませ。</span>
      <ul className="m-0 p-0 list-none" role="listbox">
        {fetchPointPackagesOperations.payload?.map((pointPackage, index) => (<PointPlanListItem key={index} point={numberUtils.formatNumberToLocaleString(pointPackage.points)} price={numberUtils.formatNumberToLocaleString(pointPackage.price)} onPurchase={() => onPurchase(userInfo, pointPackage)} />))}
      </ul>
    </div>
  </div>
}