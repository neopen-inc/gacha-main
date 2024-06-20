'use client'

import { CustomerInput } from "@gacha-expo-app/components/common/customer-input";
import { UserAddress } from "@gacha-expo-app/domain/user/types";
import { PostUserAddressDto } from "@gacha-expo-app/domain/user/dto";
import { useAppDispatch, useAppSelector } from "@gacha-expo-app/store/hooks";
import { setPageTitle, setReturnPage } from "@gacha-expo-app/store/page";
import { fetchUserAddresses, updateUserAddress } from "@gacha-expo-app/domain/user";
import { todofukenList } from "@gacha-expo-app/util/todofuken";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

type AddressForm = PostUserAddressDto;
const addressFormSchema = z.object({
  firstName: z
    .string().min(1, { message: "この項目は必須です" }),
  lastName: z.string().min(1, { message: "この項目は必須です" }),
  firstNameKana: z
    .string().min(1, { message: "この項目は必須です" }),
  lastNameKana: z
    .string().min(1, { message: "この項目は必須です" }),
  phoneNumber: z
    .string().min(7, { message: "正しい電話番号を入力してください" }),
  postcode: z
    .string().min(7, { message: "正しい郵便番号を入力してください" }),
  addressline1: z
    .string().min(1, { message: "この項目は必須です" }),
  addressline2: z
    .string().min(1, { message: "この項目は必須です" }),
  addressline3: z
    .string().optional(),
});
export default function AddressRegisterPage({params}: { params: { id: string; }}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const addresses: UserAddress[] = useAppSelector(state => state.user.myInfo.addresses);

  useEffect(() => {
    dispatch(setPageTitle('郵送先編集'));
    dispatch(setReturnPage('/mypage/address'));
  }, []);

  const defaultAddressFormValues: AddressForm = useMemo(() => {
    return addresses.find((address) => address.id === params.id) || {
      lastName: '',
      firstName: '',
      lastNameKana: '',
      firstNameKana: '',
      phoneNumber: '',
      postcode: '',
      addressline1: '',
      addressline2: '', 
      addressline3: '',
    }}, [addresses]);
  const addressForm = useForm<AddressForm>({
    defaultValues: defaultAddressFormValues,
    mode: 'all',
    resolver: zodResolver(addressFormSchema),
  });

  const { formState: { errors } } = addressForm;
  useEffect(() => {
    addressForm.reset(defaultAddressFormValues);
  }, [addressForm, defaultAddressFormValues]);
  React.useEffect(() => {
    if (!userProfile?.id) {
      return;
    }
    dispatch(fetchUserAddresses(userProfile.id));
  }, [dispatch, userProfile]);

  const updateAddress = (data: AddressForm) => {
    if (userProfile === undefined) {
      return;
    }
    dispatch(updateUserAddress({ userId: userProfile?.id || '', addressId: params.id, address: data })).then(() => {
      addressForm.reset();
      router.push('/mypage/address');
    });
  }

  return <div>
    <div className="py-6 px-2 lg:px-6">
      <form className="grid grid-cols-2" onSubmit={addressForm.handleSubmit(updateAddress)}>
        <Controller name="lastName" control={addressForm.control} render={({ field }) => (
          <div>
            <CustomerInput label="姓" {...field} className="mr-2 flex flex-col" />
            {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
          </div>
          )} />
        <Controller name="firstName" control={addressForm.control} render={({ field }) => (
          <div>
            <CustomerInput label="名" {...field} className=" flex flex-col" />
            {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
          </div>)} />
        <Controller name="lastNameKana" control={addressForm.control} render={({ field }) => (
          <div>
            <CustomerInput label="せい" {...field} className="mr-2 flex flex-col" />
            {errors.lastNameKana && <span className="text-red-500 text-xs">{errors.lastNameKana.message}</span>}
          </div>)} />
        <Controller name="firstNameKana" control={addressForm.control} render={({ field }) => (
          <div>
            <CustomerInput label="めい" {...field} className=" flex flex-col" />
            {errors.firstNameKana && <span className="text-red-500 text-xs">{errors.firstNameKana.message}</span>}
          </div>)} />
        <Controller name="phoneNumber" control={addressForm.control} render={({ field }) => (
          <div className="col-span-2">
            <CustomerInput label="電話番号" {...field} className="col-span-2 w-full flex flex-col"  />
            {errors.phoneNumber && <span className="text-red-500 text-xs">{errors.phoneNumber.message}</span>}
          </div>)} />
        <Controller name="postcode" control={addressForm.control} render={({ field }) => (
          <div className="col-span-2">
            <CustomerInput label="郵便番号" {...field} className="col-span-2 w-full flex flex-col"  />
            {errors.postcode && <span className="text-red-500 text-xs">{errors.postcode.message}</span>}
          </div>)} />
        <Controller name="addressline1" control={addressForm.control} render={({ field }) => (
          <div className="mr-2 flex flex-col col-span-2">
            <label >都道府県</label>
            <Select size="small" {...field} >
            {todofukenList.map((todofuken, index) => <MenuItem key={index} value={todofuken}>{todofuken}</MenuItem>)}
          </Select>
          {errors.addressline1 && <span className="text-red-500 text-xs">{errors.addressline1.message}</span>}
          </div>
        )} />
        <Controller name="addressline2" control={addressForm.control} render={({ field }) => (
          <div className="col-span-2">
            <CustomerInput label="住所" {...field} className="col-span-2 w-full flex flex-col"  />
            {errors.addressline2 && <span className="text-red-500 text-xs">{errors.addressline2.message}</span>}
          </div>  
        )} />
        <Controller name="addressline3" control={addressForm.control} render={({ field }) => (
          <div className="col-span-2">
            <CustomerInput label="建物" {...field} className="col-span-2 w-full flex flex-col" />
            {errors.addressline3 && <span className="text-red-500 text-xs">{errors.addressline3.message}</span>}
          </div>
        )} />
        <div className="flex flex-row py-5 space-x-5 justify-end col-span-2">
          <Button onClick={() => router.back()} variant="outlined" color="primary" className="shrink-0" >キャンセル</Button>
          <PrimaryButton type="submit" className="shrink-0" >保存</PrimaryButton>
        </div>
      </form>

    </div>
  </div>
}