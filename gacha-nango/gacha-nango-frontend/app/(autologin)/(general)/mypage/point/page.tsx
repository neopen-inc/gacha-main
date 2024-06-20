'use client'

import { PointPlanListItem } from "@gacha-nango-app/components/point/point-plan-list-item";
import { PointPackage, fetchPointPackages, createCheckoutSession} from "@gacha-nango-app/domain/point";
import { User } from "@gacha-nango-app/domain/user";

import { useAppDispatch, useAppSelector } from "@gacha-nango-app/store/hooks";
import { setPageTitle, setReturnPage } from "@gacha-nango-app/store/page";
import { numberUtils } from "@common-utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function PointPage() {
  const userInfo = useAppSelector(state => state.user.myInfo.userProfile);
  const pointPackages = useAppSelector(state => state.point.operation.fetchPointPackages.payload);
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
    })).unwrap().then((result) => { console.log(result.url); window.location.href = result.url; });
  }
  useEffect(() => {
    dispatch(setPageTitle('ポイント購入'));
    dispatch(setReturnPage('/'));
    dispatch(fetchPointPackages({ orderby: 'price asc'}));
  }, [])
  return <div className="flex justify-center w-full">
    <section className="mt-10 w-[80%] flex flex-row flex-wrap">
      <header className="rounded-t-md text-white bg-primary flex flex-row w-full justify-left items-center px-5 py-2">
        <span>ポイント購入</span>
      </header>
      <div className="bg-white p-6 w-full " style={{
        boxShadow: '0 0 10px 0 rgba(0,0,0,0.1)'
      }}>
        <div className="justify-between flex mb-10">
          <div><span className="text-primary pr-2 font-bold">ⓟ</span>所持ポイント</div> 
          <div>{numberUtils.formatNumberToLocaleString(userInfo?.points)} pt</div>
        </div>
        <span className="text-secondary text-sm text-left">ご希望のポイントをお選びください</span>
        <ul className="m-0 p-0 list-none" role="listbox">
          {pointPackages?.map((pointPackage, index) => (<PointPlanListItem key={index} point={numberUtils.formatNumberToLocaleString(pointPackage.points)} price={numberUtils.formatNumberToLocaleString(pointPackage.price)} onPurchase={() => onPurchase(userInfo, pointPackage)} />))}
        </ul>
      </div>
    </section>
  </div>
}

/**
<div className="rounded mb-5">所持ポイント: {numberUtils.formatNumberToLocaleString(userInfo?.points)} points</div>
 */
