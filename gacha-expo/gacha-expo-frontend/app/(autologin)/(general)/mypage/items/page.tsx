'use client'
import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@gacha-expo-app/store/hooks"
import { types } from '@common-utils';
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "@gacha-expo-app/domain/user/store";
import { ResultBox } from "@gacha-expo-app/components/common/result-box";
import { setPageTitle, setReturnPage } from "@gacha-expo-app/store/page";
import store from "@gacha-expo-app/store";
import _ from "lodash";
import { BaseDialog } from "@gacha-expo-app/components/dialog/base-dialog";
import { Button, MenuItem, Select, Tab, Tabs } from "@mui/material";
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { LineItem } from "@gacha-expo-app/domain/oripa/types/line-item";
import { clearReturnItem, fetchUserLineItems, prepareReturnItem, returnMany } from "@gacha-expo-app/domain/oripa/action";
import { fetchUserAddresses } from "@gacha-expo-app/domain/user";
import { clearCreateShipping, createShipping, prepareCreateShipping } from "@gacha-expo-app/domain/shipping";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

export default function MyLineItems() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const myLineItems: {
    unselected: types.Paginated<LineItem>,
    shipped: types.Paginated<LineItem>,
    waiting_for_ship: types.Paginated<LineItem>,
    returned: types.Paginated<LineItem>,
  } = useAppSelector(state => state.oripa.myLineItems);
  const [activeTab, setActiveTab] = React.useState<string>("unselected");

  const createReturnOperation = useAppSelector(state => state.oripa.operations.returnItem);
  const createShippingOperation = useAppSelector(state => state.shipping.operations.createShipping);
  const addresses = useAppSelector(state => state.user.myInfo.addresses);
  const [selectedAddress, setSelectedAddress] = React.useState<string | undefined>('');
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const refreshCards = (userId: string) => {
    dispatch(fetchUserLineItems({ userId, query: { status: 'unselected', orderby: 'updatedAt desc' } })).unwrap().then((res) => {
      setUnselectedCards(res.lineItemResult.data);
    });
    dispatch(fetchUserLineItems({ userId, query: { status: 'waiting_for_ship', orderby: 'updatedAt desc' } })).unwrap().then((res) => {
      setWaitingCards(res.lineItemResult.data);
    });
    dispatch(fetchUserLineItems({ userId, query: { status: 'shipped', orderby: 'updatedAt desc' } })).unwrap().then((res) => {
      setShippedCards(res.lineItemResult.data);
    });
  }

  const [unselectedCards, setUnselectedCards] = React.useState<LineItem[]>([]);
  const [shippedCards, setShippedCards] = React.useState<LineItem[]>([]);
  const [waitingCards, setWaitingCards] = React.useState<LineItem[]>([]);

  useEffect(() => {
    dispatch(setPageTitle('カード獲得履歴'));
    dispatch(setReturnPage('/mypage'));
  }, []);

  React.useEffect(() => {
    if (!userProfile?.id) {
      return;
    }
    dispatch(fetchUserAddresses(userProfile.id));
  }, [dispatch, userProfile]);
  
  const hasSelectedItems = (): boolean => {
    return selectedCount() > 0;
  }

  const returnPoints = (): number => {
    let returnItems: string[] = Object.keys(selected);
    return returnItems.reduce((acc, cur) => {
      const lineItem = myLineItems?.unselected.data.find((item) => item.id === cur);
      if (!lineItem) {
        return acc;
      }
      return acc + Number(lineItem.card.points);
    }, 0)
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
    dispatch(
      prepareCreateShipping({ userId: userProfile.id, addressId: selectedAddress, lineItems: Object.keys(selected) })
    ).unwrap().then(() => {}).catch(() => {
      
    });
  }
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
  const onCreateReturn = () => {
    if (!userProfile?.id) {
      router.push('/login');
      return;
    };
    let returnItems: string[] = [];
    if (hasSelectedItems()) {
      returnItems = Object.keys(selected);
    }
    dispatch(prepareReturnItem({ userId: userProfile.id, lineItems: returnItems }));
  }
  React.useEffect(() => {
    const userId = store.getState().user.myInfo.userProfile?.id
    if (!userProfile?.id) {
      return;
    }
    refreshCards(userProfile.id);
    setSelectedAddress(userProfile?.defaultAddressId);
  }, [dispatch, userProfile])

  const renderCards = (status: string, selectable: boolean) => {
    if (!userProfile?.id) {
      return;
    }
    const lineItems: LineItem[] = status === 'unselected' ? unselectedCards :
      status === 'waiting_for_ship' ? waitingCards : shippedCards;
    
    return <div className="pb-96 flex flex-col gap-10 items-center">
      <div className="grid gap-y-2 gap-x-2 lg:gap-x-6 lg:gap-y-10 grid-cols-2 lg:grid-cols-2  bg-white w-full pt-5">
      {
        lineItems.map((lineItem, index) =>
        lineItem.card ? <ResultBox key={index} thumbnail={lineItem.card.thumbnail} name={lineItem.card.name} points={lineItem.card.points.toString()} selected={!!selected[lineItem.id]} onClick={() => { selectable && toggleSelect(lineItem.id) }} /> :
        <ResultBox key={index} thumbnail={''} name={'カードが削除された'} points={"0"} selected={false} onClick={() => {}} />
        )
      }
    </div>
      <Button className="text-primary hover:shadow-none shadow-none  border-primary w-36" variant="outlined"
      onClick={() => {
        dispatch(fetchUserLineItems({ userId: userProfile.id, query: { status, orderby: 'updatedAt desc', skip: lineItems.length } })).unwrap().then((res) => {
          if (status === 'unselected') {
            setUnselectedCards([
              ...unselectedCards,
              ...res.lineItemResult.data
            ]);
          } else if (status === 'waiting_for_ship') {
            setWaitingCards([
              ...waitingCards,
              ...res.lineItemResult.data
            ]);
          } else if (status === 'shipped') {
            setShippedCards([
              ...shippedCards,
              ...res.lineItemResult.data
            ]);
          }
        });
      }}
      >
        MORE
      </Button>
    </div>
  }

  const data = [
    {
      label: "未選択",
      value: "unselected",
    },
    {
      label: "発送待ち",
      value: "waiting_for_ship",
    },
    {
      label: "発送済み",
      value: "shipped",

    },
  ];
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  };


  return (
    <div className="relative lg:max-w-3xl w-screen lg:w-3xl mx-auto display: flex; flex-direction: column; ">


      <TabContext value={activeTab} >
      
      <TabList variant="fullWidth" className="w-full" onChange={handleChange} aria-label="">
      {data.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            label={label}
            onClick={() => setActiveTab(value)}
            className={activeTab === value ? "text-red-500 font-bold" : " font-semibold"}
          />
        ))}
      </TabList>
        
        
        {data.map(({ value }: { value: string}) => (
          <TabPanel key={value} value={value}>
            {renderCards(value, value === 'unselected')}
          </TabPanel>
        ))}
      </TabContext>

      {
        activeTab === 'unselected' && <footer className="w-full h-30">
          <div className="fixed bottom-0 space-x-10 h-30 flex flex-col bg-gray-200 space-y-2 lg:max-w-3xl w-screen lg:w-3xl p-5" >
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 ">
              <div className="flex space-x-2">
                <span>選択ポイント</span>
                {myLineItems.unselected.data?.reduce((acc, cur) => acc + (selected[cur.id] ? cur.card.points : 0), 0)}
              </div>

              <Select size="small" onChange={event => setSelectedAddress(event.target.value)} value={selectedAddress} className="min-w-0" label="郵送先">
                {(addresses || []).map((address, index) => <MenuItem key={index} value={address.id}>〒{address.postcode}-{address.lastName}{address.firstName}</MenuItem>)}
              </Select>
              <Button disabled={!hasSelectedItems()} className="basis-0" color="primary" variant="outlined" onClick={() => onCreateReturn()}>{selectedCount()}枚カードを還元</Button>
              <PrimaryButton disabled={!hasSelectedItems()} className="basis-0" onClick={onCreateShipping}>{selectedCount()}枚発送</PrimaryButton>
            </div>
          </div>
        </footer>
      }
    <BaseDialog color="primary" isOpen={createShippingOperation.status === 'confirm'} title={"発送のご確認"} content={"選択したカードを発送してもよろしいでしょうか"} confirmLabel={"確認"} cancelLabel={"キャンセル"} onConfirm={function (): void {
      if (!createShippingOperation.payload) {
        return;
      }
      dispatch(createShipping(createShippingOperation.payload)).finally(() => {
        setSelected({});
        if (userProfile?.id) {
          dispatch(fetchUserProfile(userProfile?.id));
          //dispatch(clearOperationStatus('createShipping'));
          refreshCards(userProfile.id);
        }
      })
    }} onCancel={function (): void {
      setSelected({});
      dispatch(clearCreateShipping())
    }} />
    <BaseDialog color="red" isOpen={createShippingOperation.status === 'failed'} title={"発送失敗しました"} content={<><p className="text-black">発送できませんでした</p></>} confirmLabel={"確認"} onConfirm={function (): void {
      dispatch(clearCreateShipping());
    }} />
    <BaseDialog color="primary" isOpen={createShippingOperation.status === 'succeeded'} title={"商品の発送依頼を承りました"} content={<><p className="text-black">発送を希望した商品は10営業日〜15営業日以内で梱包、発送処理を完了します</p><p className="text-black">商品到着まで今しばらくお待ちください。</p></>} confirmLabel={"オリパページに戻る"} 
    onConfirm={function (): void {
      dispatch(clearCreateShipping());
    }} />
    <BaseDialog color="gray" isOpen={createReturnOperation.status === 'confirm'} title={"ポイント還元のご確認"} content={`選択したカードを${returnPoints()}ポイント還元にしてもよろしいでしょうか`} confirmLabel={"確認"} cancelLabel={"キャンセル"} onConfirm={async function () {
      if (!createReturnOperation.payload) {
        return;
      }
      dispatch(returnMany(createReturnOperation.payload)).finally(() => {
        setSelected({});
        if (userProfile?.id) {
          
          dispatch(fetchUserProfile(userProfile?.id));
          dispatch(clearReturnItem());
          refreshCards(userProfile.id);
        }
      })
    }} onCancel={async function () {
      setSelected({});
      dispatch(clearReturnItem())
    }} />

    </div>

  );

}