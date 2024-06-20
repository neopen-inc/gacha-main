'use client'

import { logout, fetchUserAddresses } from "@cardpia-app/domain/user";
import { useAppDispatch, useAppSelector } from "@cardpia-app/store/hooks"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

export default function MyPage() {
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    //dispatch(setPageTitle('マイページ'));
    //dispatch(setReturnPage('/'));
  }, []);
  useEffect(() => {
    if (userProfile) {
      dispatch(fetchUserAddresses(userProfile.id));
    }
  }, [userProfile]);
  //const userPointTransactions = 
  return <>
    
    <div className="pb-20 ">
      <div className="p-4">
        <div className="text-gray-500 mb-10">保有ポイント:<span className="text-black font-semibold">{userProfile?.points ? userProfile?.points.toLocaleString() : ''}Points</span></div>
        <div className="text-gray-500 mb-10">
          このポイントはオリパページでのみご利用可能です。
        </div>

        <div className="flex justify-between">
          <PrimaryButton onClick={() => router.push('/mypage/point')}>ポイントを購入</PrimaryButton>
        </div>
      </div>

      <div className="p-4">
        <PrimaryButton onClick={() => router.push('/mypage/account')}>アカウント編集</PrimaryButton>
      </div>
      <div className="p-4">
      <PrimaryButton onClick={() => dispatch(logout(window.localStorage)).then(() => router.push('/'))}>ログアウト</PrimaryButton>
      </div>
    </div>
  </>
}