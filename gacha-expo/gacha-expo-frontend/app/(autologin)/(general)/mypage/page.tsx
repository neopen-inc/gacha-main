'use client'

import { Hr } from "@gacha-expo-app/components/common/hr";
import { useAppDispatch, useAppSelector } from "@gacha-expo-app/store/hooks"
import { setPageTitle, setReturnPage } from "@gacha-expo-app/store/page";
import { fetchUserAddresses, logout } from "@gacha-expo-app/domain/user";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

export default function MyPage() {
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageTitle('マイページ'));
    dispatch(setReturnPage('/'));
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
        <div className="text-gray-500 mb-10">保有ポイント:<span className="text-black font-semibold">{userProfile?.points ? userProfile?.points.toLocaleString() : ''}Pt</span></div>
        <div className="text-gray-500 mb-10">
          このポイントはオリパページでのみご利用可能です。
        </div>

        <div className="flex justify-between">
          <PrimaryButton size="medium" color="primary" onClick={() => router.push('/point')}>ポイントを購入</PrimaryButton>
        </div>
      </div>

      <Hr />

      <div className="p-4">
        <div className="text-gray-500 mb-10">カード獲得履歴</div>
        <PrimaryButton size="medium" onClick={() => router.push('/mypage/items')} >カード一覧</PrimaryButton>
      </div>
      <Hr />
      <div className="p-4">
        <div className="text-gray-500 mb-10">郵送先の変更</div>
        <PrimaryButton size="medium" onClick={() => router.push('/mypage/address')}>郵送先管理</PrimaryButton>
      </div>
      <Hr />
      <div className="p-4">
        <PrimaryButton size="medium" onClick={() => dispatch(logout(window.localStorage)).then(() => router.push('/'))} >ログアウト</PrimaryButton>
      </div>
    </div>
  </>
}