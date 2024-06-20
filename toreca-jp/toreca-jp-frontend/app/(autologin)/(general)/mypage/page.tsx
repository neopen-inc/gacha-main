'use client'

import { Hr } from "@toreca-jp-app/components/common/hr";
import { logout, fetchUserAddresses } from "@toreca-jp-app/domain/user";
import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks"
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
          <Button type="submit" variant="contained"  className="bg-foregroundOrange" onClick={() => router.push('/mypage/point')}>ポイントを購入</Button>
        </div>
      </div>

      <div className="p-4">
        
        <div className="text-gray-500 mb-10">郵送先の変更</div>
        <Button type="submit" variant="contained"  className="bg-foregroundOrange" onClick={() => router.push('/mypage/account')}>アカウント編集</Button>
      </div>
      <Hr />
      <div className="p-4">
      <Button type="submit" variant="contained"  className="bg-foregroundOrange" onClick={() => dispatch(logout(window.localStorage)).then(() => router.push('/'))}>ログアウト</Button>
      </div>
    </div>
  </>
}