'use client'

import { ResultBox } from "@toreca-jp-app/components/common/result-box";
import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks"
import { setPageTitle, setReturnPage } from "@toreca-jp-app/store/page";
import {  fetchUserProfile, fetchUserAddresses } from "@toreca-jp-app/domain/user";
import _ from "lodash";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { createShipping } from "@toreca-jp-app/domain/shipping/action/shipping.action";
import { prepareCreateShipping, prepareReturnItem, returnMany } from "@toreca-jp-app/domain/oripa/action/line-item";
import { Button, MenuItem, Select, Typography } from "@mui/material";
import { BaseDialog } from "@toreca-jp-app/components/dialog/base-dialog";
import { clearOperationStatus } from "@toreca-jp-app/domain/oripa/store";

export default function ResultPage({params}: {
  params: {
    id: string;
  }
}) {
  const dispatch = useAppDispatch();
  const result = useAppSelector(state => state.oripa.gacha.result);
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const router = useRouter();
  const [showNoAddress, setShowNoAddress] = React.useState<boolean>(false);
  useEffect(() => {
    if (!result) {
      return;
    }
    dispatch(fetchUserProfile(result.userId));
    dispatch(setPageTitle('抽選結果'));
    dispatch(setReturnPage(`/oripa/${result?.collectionId}`));
  }, [result]);

  
  const returnPoints = (): number => {
    let returnItems: string[] = [];
    if (!result) {
      return 0;
    }
    if (hasSelectedItems()) {
      returnItems = Object.keys(selected);
    } else {
      returnItems = result.lineItems.map((lineItem) => lineItem.id);
    }
    return returnItems.reduce((acc, cur) => {
      const lineItem = result?.lineItems.find((item) => item.id === cur);
      if (!lineItem) {
        return acc;
      }
      return acc + Number(lineItem.cardToOripa.point);
    }, 0)
  }
  const [selectedAddress, setSelectedAddress] = React.useState<string | undefined>(undefined);
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const createReturnOperation = useAppSelector(state => state.oripa.operations.returnItem);
  const createShippingOperation = useAppSelector(state => state.oripa.operations.createShipping);
  
  const toggleSelect = (id: string) => {
    if (selected[id]) {
      setSelected(_.omit(selected, id));
    } else {
      setSelected({
        ...selected,
        [id]: true,
      })
    }
  }
  React.useEffect(() => {
    if (!userProfile?.id) {
      router.push('/login');
      return;
    };
    dispatch(fetchUserProfile(userProfile.id));
    dispatch(fetchUserAddresses(userProfile.id));
  }, [dispatch])

  React.useEffect(() => {
    if (!userProfile?.id) {
      return;
    };
    setSelectedAddress(userProfile?.defaultAddressId);
  }, [dispatch, userProfile]);

  const hasSelectedItems = (): boolean => {
    return selectedCount() > 0;
  }

  const selectedCount = (): number => {
    return Object.keys(selected).length;
  }

  const onCreateShipping = () => {
    if (!userProfile?.id) {
      router.push('/login');
      return;
    };
    if (selectedAddress === undefined) {
      throw new Error('selectedAddress is undefined');
    }
    if (!hasSelectedItems()) {
      throw new Error('selected is empty');
    }
    dispatch(createShipping({ userId: userProfile.id, addressId: selectedAddress, lineItems: Object.keys(selected) })).then(() => {
      dispatch(returnMany({ userId: userProfile.id, lineItems: result?.lineItems.map((lineItem) => lineItem.id).filter(id => !selected[id]) || [] }))
    }).then(() => {
      router.push(`/oripa/${result?.collectionId}`);
    });
  }

  const onReturnAll = () => {
    if (!userProfile?.id) {
      return;
    }
    dispatch(returnMany({ userId: userProfile?.id, lineItems: result?.lineItems.map((lineItem) => lineItem.id).filter(id => !selected[id]) || [] })).then(() => {
      router.push(`/oripa/${result?.collectionId}`);
    });
  }

  const onClickCreateShipping = () => {
    if (!userProfile?.id) {
      router.push('/login');
      return;
    };
    if (selectedAddress === undefined) {
      throw new Error('selectedAddress is undefined');
    }
    if (!hasSelectedItems()) {
      throw new Error('selected is empty');
    }
    dispatch(prepareCreateShipping({ userId: userProfile.id, addressId: selectedAddress, lineItems: Object.keys(selected) }));
  }
  const onClickCreateReturn = () => {
    if (!userProfile?.id || !result) {
      router.push('/login');
      return;
    };
    let returnItems: string[] = [];
    if (hasSelectedItems()) {
      returnItems = Object.keys(selected);
    } else {
      returnItems = result.lineItems.map((lineItem) => lineItem.id);
    }
    dispatch(prepareReturnItem({ userId: userProfile.id, lineItems: returnItems }));
  }


  return <section className="relative max-w-5xl mx-auto">
    
    <header className="w-full lg:py-5 p-2">
      <Typography variant="h5" className="text-md">抽選結果</Typography>
    </header>
    <section className="flex-1 overflow-y-scroll p-2">

      <div className="grid grid-cols-2 gap-4 lg:pb-32 pb-10">
        {
          result && result.lineItems.map((lineItem, index) =>
            <ResultBox key={index} thumbnail={lineItem.card.thumbnail} name={lineItem.card.name} rarity={lineItem.card.rarity} points={lineItem.cardToOripa.point.toString()} selected={!!selected[lineItem.id]} onClick={() => { toggleSelect(lineItem.id) }} />
          )
        }
      </div>
    </section>

    <footer className="w-full h-30 border-t border-gray-300">
      <div className="space-x-10 h-30 flex flex-col space-y-2 p-5" >
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 ">
          <div className="flex space-x-2">
            <span>選択ポイント</span>
            {result?.lineItems.reduce((acc, cur) => acc + (selected[cur.id] ? cur.cardToOripa.point : 0), 0)}
          </div>

          {
            userProfile?.defaultAddressId ? <Select size="small" defaultValue={userProfile?.defaultAddressId} onChange={value => setSelectedAddress(value.target.value)} value={selectedAddress} className="min-w-0" label="郵送先">
              {userProfile?.defaultAddress ? <MenuItem key={userProfile?.defaultAddress.id} value={userProfile?.defaultAddress.id}>〒{userProfile?.defaultAddress.postcode}-{userProfile?.defaultAddress.lastName}{userProfile?.defaultAddress.firstName}</MenuItem> : <></>}
            </Select>
             : <Button variant='contained' className="basis-0 bg-foregroundOrange text-white hover:bg-foregroundOrange" onClick={() => router.push("/mypage/account")}>住所設定</Button>
          }
          <Button variant='outlined' className="basis-0 bg-backgroundOrange  hover:bg-backgroundOrange shadow-none hover:shadow-none" 
            onClick={onClickCreateReturn}>{selectedCount() === 0 ? 'すべてのカードを還元' : `${selectedCount()}枚カードを還元`}</Button>
          <Button variant='contained' disabled={!hasSelectedItems()} className="basis-0 bg-foregroundOrange text-white hover:bg-foregroundOrange" onClick={() => onClickCreateShipping()}>{selectedCount()}枚発送</Button>
        </div>
      </div>
    </footer>

    <BaseDialog color="primary" isOpen={createShippingOperation.status === 'confirm'} title={"発送のご確認"} content={"選択したカードを発送してもよろしいでしょうか"} confirmLabel={"確認"} cancelLabel={"キャンセル"} onConfirm={function (): void {
      if (!createShippingOperation.payload) {
        return;
      }
      if (!createShippingOperation.payload.addressId) {
        setShowNoAddress(true);
        return;
      }
      dispatch(createShipping(createShippingOperation.payload)).finally(() => {
        setSelected({});
        if (userProfile?.id) {
          dispatch(fetchUserProfile(userProfile?.id));
        }
      })
    }} onCancel={function (): void {
      setSelected({});
      dispatch(clearOperationStatus('createShipping'))
    }} />
    <BaseDialog color="primary" isOpen={createShippingOperation.status === 'succeeded'} title={"商品の発送依頼を承りました"} content={<><p className="text-black">発送を希望した商品は10営業日〜15営業日以内で梱包、発送処理を完了します</p><p className="text-black">商品到着まで今しばらくお待ちください。</p></>} confirmLabel={"オリパページに戻る"} onConfirm={function (): void {
      dispatch(clearOperationStatus('createShipping')).then(() => {router.push(`/oripa/${result?.collectionId}`)});
    }} />
    <BaseDialog color="red" isOpen={createShippingOperation.status === 'failed'} title={"発送失敗しました"} content={<><p className="text-black">発送できませんでした</p></>} confirmLabel={"確認"} onConfirm={function (): void {
      dispatch(clearOperationStatus('createShipping'));
    }} />
    <BaseDialog color="red" isOpen={showNoAddress} title={"住所が選択されていない"} content={<><p className="text-black">発送できませんでした</p></>} confirmLabel={"確認"} onConfirm={function (): void {
      setShowNoAddress(false);
    }} />
    <BaseDialog color="primary" isOpen={createReturnOperation.status === 'confirm'} title={"ポイント還元のご確認"} content={`選択したカードを${returnPoints()}ポイント還元にしてもよろしいでしょうか`} confirmLabel={"確認"} cancelLabel={"キャンセル"} onConfirm={async function () {
      if (!createReturnOperation.payload) {
        return;
      }
      dispatch(returnMany(createReturnOperation.payload)).finally(() => {
        setSelected({});
        if (userProfile?.id) {
          
          dispatch(fetchUserProfile(userProfile?.id));
          dispatch(clearOperationStatus('returnItem'));
          router.push(`/oripa/${result?.collectionId}`)
        }
      })
    }} onCancel={async function () {
      setSelected({});
      dispatch(clearOperationStatus('returnItem'))
    }} />
    
  </section>


}


/**
 * 
 * <div className="absolute top-4 flex rounded-r-full" 
    style={{
      'boxShadow': '3px 0px 10px #D48A86',
    }}>
      <div className="pl-2 lg:pl-5 text-sm lg:text-md text-white border-r rounded-r-full bg-breadred py-3 pr-2 z-20">
      トレカジャパン！（カードガチャ）
      </div>
      <div className="pl-20 text-sm lg:text-md text-black border-r rounded-r-full bg-breadyellow py-3 pr-5 z-10 -ml-16">
        カード売却
      </div>
    </div>
 
    <footer className="w-full h-30">
      <div className="" >
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 ">
          <div className="flex space-x-2">
            <span>選択ポイント</span>
            {result?.lineItems.reduce((acc, cur) => acc + (selected[cur.id] ? cur.card.points : 0), 0)}
          </div>

          <Select onChange={value => setSelectedAddress(value)} value={selectedAddress} className="min-w-0" label="郵送先">
            {(addresses || []).map((address, index) => <Option key={index} value={address.id}>〒{address.postcode}-{address.lastName}{address.firstName}</Option>)}
          </Select>
          <Button className="basis-0 bg-black text-white shadow-none hover:shadow-none" onClick={onClickCreateReturn}>{selectedCount() === 0 ? 'すべてのカードを還元' : `${selectedCount()}枚カードを還元`}</Button>
          <Button disabled={!hasSelectedItems()} className="basis-0" color="red" onClick={() => onClickCreateShipping()}>{selectedCount()}枚発送</Button>

        </div>
      </div>
    </footer>
 */