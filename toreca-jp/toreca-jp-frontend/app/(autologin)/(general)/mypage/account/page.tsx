'use client'

import { CustomerInput } from "@toreca-jp-app/components/common/customer-input";

import { PostUserAddressDto,updateUser,createUserAddress, updateUserAddress, fetchUserProfile  } from "@toreca-jp-app/domain/user";
import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks";
import { setPageTitle, setReturnPage } from "@toreca-jp-app/store/page";
import { todofukenList } from "@toreca-jp-app/util/todofuken";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, MenuItem, Select } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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
export default function AccountPage() {
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);

  useEffect(() => {
    dispatch(setPageTitle('郵送先追加'));
    dispatch(setReturnPage('/mypage/account'));
  }, []);
  useEffect(() => {
    if (!userProfile) {
      return ;
    }
    //dispatch(fetchUserAddressById(userProfile.id, userProfile.defaultAddressId));
  }, [userProfile]);
  
  const defaultAddressFormValues: AddressForm = useMemo(() => {
    return userProfile?.defaultAddress ? {
      ...userProfile?.defaultAddress
    } : {
      lastName: '',
      firstName: '',
      lastNameKana: '',
      firstNameKana: '',
      phoneNumber: '',
      postcode: '',
      addressline1: '',
      addressline2: '', 
      addressline3: '',
    }}, [userProfile]);

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
    //dispatch(fetchUserAddresses(userProfile.id));
  }, [dispatch, userProfile]);

  const createOrUpdateAddress = (data: AddressForm) => {
    if (userProfile === undefined) {
      return;
    }
    if (userProfile.defaultAddressId) {
      dispatch(updateUserAddress({ userId: userProfile?.id || '', addressId: userProfile.defaultAddressId, address: data })).unwrap().then(() => {
        dispatch(fetchUserProfile(userProfile?.id || '')).unwrap().then(() => {
          //addressForm.reset(defaultAddressFormValues);
        });
      });
    } else {
      dispatch(createUserAddress({ userId: userProfile?.id || '', address: data })).unwrap().then((address) => {
        dispatch(updateUser({ userId: userProfile?.id || '', updateUserDto: { defaultAddressId: address.id }})).unwrap().then(() => {
          dispatch(fetchUserProfile(userProfile?.id || '')).unwrap().then(() => {
            //addressForm.reset(defaultAddressFormValues);
          });
        })
        //router.push('/mypage/address');
      });
    }
    
  }

  return <div className="flex justify-center w-full">
  <section className="p-5 max-w-2xl w-[80%] flex flex-row flex-wrap">
    <header className="rounded-t-md text-white bg-foregroundOrange flex flex-row w-full justify-left items-center px-5 py-1">
      <img src="/money-icon-white.png" className="w-5 h-5" />
      <span>アカウント編集</span>
    </header>
    <div className="bg-white p-4 w-full " style={{
      boxShadow: '0 0 10px 0 rgba(0,0,0,0.1)'
    }}>
      <div className=" ">
      <form className="" onSubmit={addressForm.handleSubmit(createOrUpdateAddress)}>
        <div className="grid grid-cols-2 gap-2">
        <Controller name="lastName" control={addressForm.control} render={({ field }) => (
          <div>
            <CustomerInput label="姓" {...field} className=" flex flex-col" />
            {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message as string}</span>}
          </div>
          )} />
        <Controller name="firstName" control={addressForm.control} render={({ field }) => (
          <div>
            <CustomerInput label="名" {...field} className=" flex flex-col" />
            {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message as string}</span>}
          </div>
          )} />
        <Controller name="lastNameKana" control={addressForm.control} render={({ field }) => (
          <div>
            <CustomerInput label="せい" {...field} className="flex flex-col" />
            {errors.lastNameKana && <span className="text-red-500 text-xs">{errors.lastNameKana.message as string}</span>}
          </div>
          )} />
        <Controller name="firstNameKana" control={addressForm.control} render={({ field }) => (
          <div>
            <CustomerInput label="めい" {...field} className=" flex flex-col" />
            {errors.firstNameKana && <span className="text-red-500 text-xs">{errors.firstNameKana.message as string}</span>}
          </div>
          )} />
        <Controller name="phoneNumber" control={addressForm.control} render={({ field }) => (
          <div className="">
            <CustomerInput label="電話番号" {...field} className="w-full flex flex-col"  />
            {errors.phoneNumber && <span className="text-red-500 text-xs">{errors.phoneNumber.message as string}</span>}
          </div>
          )} />
        <Controller name="postcode" control={addressForm.control} render={({ field }) => (
          <div>
            <CustomerInput label="郵便番号" {...field} className="col-span-2 w-full flex flex-col"  />
            {errors.postcode && <span className="text-red-500 text-xs">{errors.postcode.message as string}</span>}
          </div>
          )} />
        <Controller name="addressline1" control={addressForm.control} render={({ field }) => (
          <div className="col-span-2 ">
            <label >都道府県</label>
            <Select {...field} >
              {todofukenList.map((todofuken, index) => <MenuItem key={index} value={todofuken}>{todofuken}</MenuItem>)}
            </Select>
          {errors.addressline1 && <span className="text-red-500 text-xs">{errors.addressline1.message as string}</span>}
          </div>
        )} />
        <Controller name="addressline2" control={addressForm.control} render={({ field }) => (
          <div className="col-span-2 ">
            <CustomerInput label="住所" {...field} className="col-span-2 w-full flex flex-col"  />
            {errors.addressline2 && <span className="text-red-500 text-xs">{errors.addressline2.message as string}</span>}
          </div>
        )} />
        <Controller name="addressline3" control={addressForm.control} render={({ field }) => (
          <div className="col-span-2 ">
            <CustomerInput label="建物" {...field} className="col-span-2 w-full flex flex-col" />
            {errors.addressline3 && <span className="text-red-500 text-xs">{errors.addressline3.message as string}</span>}
          </div>
        )} />
        <div className="flex flex-row py-5 space-x-5 justify-end col-span-2">
          <Button type="submit" className="shrink-0 bg-primary shadow-none hover:shadow-none bg-orange text-white">保存</Button>
        </div>
        </div>
        
      </form>

    </div>

      
    </div>
  </section>
</div>
}