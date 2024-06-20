'use client'

import { PrimaryButton } from "@commons/components/buttons/primary-button";
import { BaseDialog } from "@gacha-colle-app/components/dialog/base-dialog";
import { clearRemoveAddress, fetchUserAddresses, prepareRemoveAddress, removeUserAddress } from "@gacha-colle-app/domain/user/action/user-address.action";
import { updateUser } from "@gacha-colle-app/domain/user/action/user.action";
import { fetchUserProfile } from "@gacha-colle-app/domain/user/store";
import { UserAddress } from "@gacha-colle-app/domain/user/types";
import { useAppDispatch, useAppSelector } from "@gacha-colle-app/store/hooks";
import { setPageTitle, setReturnPage } from "@gacha-colle-app/store/page";
import { Button, Radio } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type UserDefaultAddressForm = {
  defaultAddressId: string;
}

export default function AddressPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const addresses: UserAddress[] = useAppSelector(state => state.user.myInfo.addresses);
  const deleteAddressOperation = useAppSelector(state => state.user.operations.deleteAddress);
  useEffect(() => {
    dispatch(setPageTitle('郵送先管理'));
    dispatch(setReturnPage('/mypage'));
  }, []);
  React.useEffect(() => {
    if (!userProfile?.id) {
      return;
    }
    dispatch(fetchUserAddresses(userProfile.id));
  }, [dispatch, userProfile]);
  
  const defaultAddressForm = useForm<UserDefaultAddressForm>({
    defaultValues: {
      defaultAddressId: userProfile?.defaultAddressId || '',
    }
  });
  const { handleSubmit, control } = defaultAddressForm;
  const submitDefaultAddressId = (data: UserDefaultAddressForm) => {
    if (!userProfile?.id) {
      return;
    }
    dispatch(updateUser({ userId: userProfile.id, updateUserDto: {defaultAddressId: data.defaultAddressId} })).then(() => {
      dispatch(fetchUserProfile(userProfile.id));
      router.push('/');
    }).catch((err) => {
      console.log(err);
    });
  }

  return <div className="px-2">
    <form onSubmit={handleSubmit(submitDefaultAddressId)}>
      <ul className="py-5">
      
      {addresses.map((address, index) => <li key={index} className="border-b py-2 flex flex-row flex-nowrap items-center">
          <div>
            <Controller name="defaultAddressId" control={control} render={({ field }) => <Radio {...field} value={address.id} defaultChecked={userProfile?.defaultAddressId === address.id} />} />
          </div>
          <div className="grow">
            <div className="mb-2">
              {address.lastName} {address.firstName}
            </div>
            <div className="mb-2 text-sm text-gray-600">
              <div>〒{address.postcode}</div>
              <div>{address.addressline1}{address.addressline2}{address.addressline3}</div>
            </div>
          </div>
          <div className="grow-0 flex items-center space-x-2 shrink-0">
            <Button className="px-2 py-2" color="primary" variant="outlined"  onClick={() => router.push(`/mypage/address/update/${address.id}`)}>編集</Button>
            <Button className="px-2 py-2" color="primary" variant="outlined" onClick={() => dispatch(prepareRemoveAddress({ userId: userProfile?.id || '', addressId: address.id }))}>削除</Button>
          </div>
        </li>)
      }
      </ul>
      <div className="flex flex-col space-y-5">
        <Button color="primary" variant="outlined" onClick={() => router.push(`/mypage/address/create`)}>新しい郵送先を追加</Button>
        <PrimaryButton type="submit" >決定</PrimaryButton>
      </div>
    </form>

    <BaseDialog color="gray" isOpen={deleteAddressOperation.status === 'confirm'} title={"郵送先を削除"} content={`郵送先を削除してもよろしいでしょうか？`} confirmLabel={"確認"} cancelLabel={"キャンセル"} onConfirm={async function () {
      if (!deleteAddressOperation.payload) {
        return ;
      }
      dispatch(removeUserAddress(deleteAddressOperation.payload)).finally(() => {
        if (userProfile?.id) {
          dispatch(fetchUserProfile(userProfile?.id));
          dispatch(fetchUserAddresses(userProfile?.id));
          dispatch(clearRemoveAddress());
        }
      })
    }} onCancel={async function () {
      dispatch(clearRemoveAddress());
    }} />
  </div>
}