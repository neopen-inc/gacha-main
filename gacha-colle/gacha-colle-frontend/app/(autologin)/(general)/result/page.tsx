'use client'

import { ResultBox } from "@gacha-colle-app/components/common/result-box";
import { BaseDialog } from "@gacha-colle-app/components/dialog/base-dialog";
import { useAppDispatch, useAppSelector } from "@gacha-colle-app/store/hooks"
import { setPageTitle, setReturnPage } from "@gacha-colle-app/store/page";
import { fetchUserAddresses, fetchUserProfile } from "@gacha-colle-app/domain/user";
import { Button, MenuItem, Select, Typography } from "@mui/material";
import _ from "lodash";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { clearReturnItem, prepareReturnItem, returnMany } from "@gacha-colle-app/domain/oripa/action";
import { clearCreateShipping, createShipping, prepareCreateShipping } from "@gacha-colle-app/domain/shipping";
import { PrimaryButton } from "@commons/components/buttons/primary-button";


export default function ResultPage() {
  const dispatch = useAppDispatch();
  const result = useAppSelector(state => state.oripa.gacha.result);
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const router = useRouter();
  useEffect(() => {
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
      return acc + Number(lineItem.card.points);
    }, 0)
  }

  const addresses = useAppSelector(state => state.user.myInfo.addresses);
  const [selectedAddress, setSelectedAddress] = React.useState<string | undefined>('');
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const createReturnOperation = useAppSelector(state => state.oripa.operations.returnItem);
  const createShippingOperation = useAppSelector(state => state.shipping.operations.createShipping);
  const [showNoAddress, setShowNoAddress] = React.useState<boolean>(false);
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
      return;
    };
    dispatch(fetchUserAddresses(userProfile.id));
    setSelectedAddress(userProfile.defaultAddressId);
  }, [dispatch, userProfile])
  
  const hasSelectedItems = (): boolean => {
    return selectedCount() > 0;
  }

  const selectedCount = (): number => {
    return Object.keys(selected).length;
  }
  const onConfirmShipping = () => {
    if (!createShippingOperation.payload) {
      return;
    }
    dispatch(createShipping(createShippingOperation.payload)).finally(() => {
      setSelected({});
      if (userProfile?.id) {
        dispatch(fetchUserProfile(userProfile?.id));
      }
    })
  }
  const onConfirmReturn = () => {
    if (!createReturnOperation.payload) {
      return;
    }
    dispatch(returnMany(createReturnOperation.payload)).finally(() => {
      setSelected({});
      if (userProfile?.id) {
        dispatch(fetchUserProfile(userProfile?.id));
        dispatch(clearReturnItem());
        router.push(`/oripa/${result?.collectionId}`)
      }
    })
  }
  const onCancelReturn = () => {
    setSelected({});
    dispatch(clearReturnItem())
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
    dispatch(
      prepareCreateShipping({ userId: userProfile.id, addressId: selectedAddress, lineItems: Object.keys(selected) })
    ).unwrap().then(() => {}).catch(() => {
      
    });
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
  return <div className="lg:max-w-3xl w-screen lg:w-3xl m-auto display: flex; flex-direction: column;">
    <header className="w-full lg:py-5 p-2">
      <Typography variant="h5" className="text-md">抽選結果</Typography>
    </header>
    <section className="flex-1 overflow-y-scroll p-2">

      <div className="grid grid-cols-2 gap-4 pt-5 pb-80">
        {
          result && result.lineItems.map((lineItem, index) =>
            <ResultBox key={index} thumbnail={lineItem.card.thumbnail} name={lineItem.card.name} points={lineItem.card.points.toString()} selected={!!selected[lineItem.id]} onClick={() => { toggleSelect(lineItem.id) }} />
          )
        }
      </div>
    </section>
    <footer className="w-full h-30 z-20">
      <div className="fixed bottom-0 space-x-10 h-30 flex flex-col bg-gray-200 space-y-2 lg:max-w-3xl w-screen lg:w-3xl p-5" >
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 ">
          <div className="flex space-x-2">
            <span>選択ポイント</span>
            {result?.lineItems.reduce((acc, cur) => acc + (selected[cur.id] ? cur.card.points : 0), 0)}
          </div>

          <Select size="small" onChange={value => setSelectedAddress(value.target.value)} value={selectedAddress} className="min-w-0" label="郵送先">
            {(addresses || []).map((address, index) => <MenuItem key={index} value={address.id}>〒{address.postcode}-{address.lastName}{address.firstName}</MenuItem>)}
          </Select>
          <Button 
            variant="contained" 
            color="secondary" 
            className="basis-0 bg-black text-white shadow-none hover:shadow-none" 
            onClick={onClickCreateReturn}>
              {selectedCount() === 0 ? 'すべてのカードを還元' : `${selectedCount()}枚カードを還元`}
          </Button>
          <PrimaryButton
            disabled={!hasSelectedItems()} 
            className="basis-0" 
            onClick={onClickCreateShipping}>
            {selectedCount()}枚発送
          </PrimaryButton>
        </div>
      </div>
    </footer>
    <BaseDialog 
      color="primary" 
      isOpen={createShippingOperation.status === 'confirm'} 
      title={"発送のご確認"} 
      content={"選択したカードを発送してもよろしいでしょうか"} 
      confirmLabel={"確認"} 
      cancelLabel={"キャンセル"} 
      onConfirm={onConfirmShipping} 
      onCancel={() =>{
        setSelected({});
        dispatch(clearCreateShipping())
      }} 
    />
    <BaseDialog 
      color="primary" 
      isOpen={createShippingOperation.status === 'succeeded'} 
      title={"商品の発送依頼を承りました"} 
      content={<><p className="text-black">発送を希望した商品は10営業日〜15営業日以内で梱包、発送処理を完了します</p><p className="text-black">商品到着まで今しばらくお待ちください。</p></>} 
      confirmLabel={"オリパページに戻る"} 
      onConfirm={() => {
        dispatch(clearCreateShipping()).then(() => {router.push(`/oripa/${result?.collectionId}`)
      });
    }} />
    <BaseDialog 
      color="red" 
      isOpen={createShippingOperation.status === 'failed'} 
      title={"発送失敗しました"} 
      content={<><p className="text-black">発送できませんでした</p></>} 
      confirmLabel={"確認"} 
      onConfirm={() => {
        dispatch(clearCreateShipping());
      }} 
    />
    <BaseDialog 
      color="red" 
      isOpen={showNoAddress} 
      title={"住所が選択されていない"} 
      content={<><p className="text-black">発送できませんでした</p></>} 
      confirmLabel={"確認"} 
      onConfirm={() => {
        setShowNoAddress(false);
      }} 
    />
    <BaseDialog 
      color="primary" 
      isOpen={createReturnOperation.status === 'confirm'} 
      title={"ポイント還元のご確認"} 
      content={`選択したカードを${returnPoints()}ポイント還元にしてもよろしいでしょうか`} 
      confirmLabel={"確認"} 
      cancelLabel={"キャンセル"}
      onConfirm={onConfirmReturn}
      onCancel={onCancelReturn} />
  </div >
}