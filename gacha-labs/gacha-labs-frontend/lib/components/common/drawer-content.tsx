'use client'
import { User } from "@gacha-labs-app/domain/types";
import { useAppDispatch } from "@gacha-labs-app/store/hooks";
import { numberUtils } from "@common-utils";
import { BuildingStorefrontIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, IconButton, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@gacha-labs-app/domain/user";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

export interface DrawerContentProps {
  userProfile: User;
  closeDrawerRight: () => void;
}
export default function DrawerContent({ userProfile, closeDrawerRight }: DrawerContentProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return <>
    <div className="mb-2 flex items-center justify-between">
    <Typography variant="h6">
      マイページ
    </Typography>
    <IconButton
      onClick={closeDrawerRight}
    >
      <XMarkIcon strokeWidth={2} className="h-5 w-5" />
    </IconButton>
  </div>
  <hr className="h-px bg-gray-200 border-0"></hr>
  <div className="px-4">
    <div className="text-xs	py-2 flex flex-row items-center space-x-1">
      <BuildingStorefrontIcon className="w-3 h-3" /> 
      <span>保有ポイント</span>
    </div>
    <div className="text-md font-bold">
      {numberUtils.formatNumberToLocaleString(userProfile.points)} points
    </div>
    <div className="py-2 flex">
      <PrimaryButton className="grow"  onClick={() => router.push('/point')}>ポイントを購入</PrimaryButton>
    </div>
    <div className="py-5">
      <div>郵送先の変更</div>
      <div className="border-gray-500 border py-5 px-3 cursor-pointer rounded-xl" onClick={() => router.push('/mypage/address')}>
        {userProfile.defaultAddress ? <div>
          <div>{userProfile.defaultAddress.lastName} {userProfile.defaultAddress.firstName}</div>
          <div>〒{userProfile.defaultAddress.postcode}</div>
          <div>{userProfile.defaultAddress.addressline1}{userProfile.defaultAddress.addressline2}{userProfile.defaultAddress.addressline3}</div>
        </div> : <div className="text-gray-500">郵送先を登録します</div>}
      </div>
    </div>
    <div className="py-5">
      <div className="cursor-pointer border-b border-black inline-block" onClick={() => router.push('/mypage/items')}>獲得履歴</div>
    </div>
    <div className="text-gray-500 text-xs flex flex-col pt-5 space-y-5">
      
      <Link href="/term">
        利用規約
      </Link>
      <Link href="/privacy">
      プライバシーポリシー
      </Link>
    </div>
    <div className="py-5">
    <Button color="primary" onClick={() => dispatch(logout(localStorage))}>ログアウト</Button>
    </div>
  </div>
  </>
}