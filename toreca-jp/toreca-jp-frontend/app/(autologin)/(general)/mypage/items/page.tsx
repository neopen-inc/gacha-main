'use client'
import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks"
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "@toreca-jp-app/domain/user";
import { ResultBox } from "@toreca-jp-app/components/common/result-box";
import { setPageTitle, setReturnPage } from "@toreca-jp-app/store/page";
import store from "@toreca-jp-app/store";
import _ from "lodash";
import { BaseDialog } from "@toreca-jp-app/components/dialog/base-dialog";
import { LineItem } from "@toreca-jp-app/domain/oripa/types/line-item";
import { fetchUserLineItems, prepareCreateShipping, prepareReturnItem, returnMany } from "@toreca-jp-app/domain/oripa/action/line-item";
import { createShipping } from "@toreca-jp-app/domain/shipping/action/shipping.action";
import { clearOperationStatus } from "@toreca-jp-app/domain/oripa/store";
import { Button, MenuItem, Select } from "@mui/material";
import { types } from "@common-utils";
import { Tab } from "@mui/material";
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';


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

  const [unselectedCards, setUnselectedCards] = React.useState<LineItem[]>([]);
  const [shippedCards, setShippedCards] = React.useState<LineItem[]>([]);
  const [waitingCards, setWaitingCards] = React.useState<LineItem[]>([]);

  const [selectedAddress, setSelectedAddress] = React.useState<string | undefined>(undefined);
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const createReturnOperation = useAppSelector(state => state.oripa.operations.returnItem);
  const createShippingOperation = useAppSelector(state => state.oripa.operations.createShipping);
  const [showNoAddress, setShowNoAddress] = React.useState<boolean>(false);
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
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  };

  useEffect(() => {
    dispatch(setPageTitle('カード獲得履歴'));
    dispatch(setReturnPage('/mypage'));
  }, []);
  
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
      return acc + Number(lineItem.cardToOripa.point);
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
    dispatch(prepareCreateShipping({ userId: userProfile.id, addressId: selectedAddress, lineItems: Object.keys(selected) }));
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
    /*
    if (userId === undefined) {
      router.push('/login');
      return;
    }
    */
    refreshCards(userId || '');
    setSelectedAddress(userProfile?.defaultAddressId);
  }, [userProfile])

  const renderCards = (status: string, selectable: boolean) => {
    if (!userProfile?.id) {
      return;
    }
    const lineItems: LineItem[] = status === 'unselected' ? unselectedCards :
      status === 'waiting_for_ship' ? waitingCards : shippedCards;

    return <div className="pb-16 flex flex-col gap-10 items-center">
        <div className="grid gap-y-2 gap-x-2 lg:gap-x-6 grid-cols-2 lg:grid-cols-2 bg-white w-full pt-5">
        {
          lineItems && lineItems.map((lineItem, index) =>
          lineItem.card && lineItem.cardToOripa && <ResultBox key={index} thumbnail={lineItem.card.thumbnail} name={lineItem.card.name} rarity={lineItem.card.rarity} points={lineItem.cardToOripa.point.toString()} selected={!!selected[lineItem.id]} onClick={() => { selectable && toggleSelect(lineItem.id) }} />)
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

  return (
    <div className="relative lg:max-w-3xl lg:w-3xl mx-auto md:pt-5">
      <TabContext value={activeTab} >
      
      <TabList TabIndicatorProps={{
        style: {transition: 'none', display: 'none'},
      }}
     variant="fullWidth" className="w-full" onChange={handleChange} aria-label="">
      {data.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            label={label}
            onClick={() => setActiveTab(value)}
            style={{color: activeTab === value ? "white" : "#CB794A", backgroundColor: activeTab === value ? "#CB794A" : "white"}}
            className={`${activeTab === value ? "text-white md:font-bold bg-primary font-semibold " : "md:font-semibold text-primary bg-backgroundOrange"} px-0 py-1 md:py-2 text-sm md:mx-2 md:rounded-md`}
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
        activeTab === 'unselected' &&
          <footer className="w-full h-30 border-t border-gray-300">
          <div className="space-x-10 h-30 flex flex-col space-y-2 lg:max-w-3xl lg:w-3xl p-5" >
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 ">
              <div className="flex space-x-2">
                <span>選択ポイント</span>
                {myLineItems.unselected.data?.reduce((acc, cur) => acc + (selected[cur.id] ? cur.cardToOripa.point : 0), 0)}
              </div>

              <Select size="small" onChange={value => setSelectedAddress(value.target.value)} value={selectedAddress} className="min-w-0" label="郵送先">
                {(userProfile?.defaultAddress ? [userProfile?.defaultAddress] :[]).map(address => <MenuItem key={address.id} value={address.id}>〒{address.postcode}-{address.lastName}{address.firstName}</MenuItem>)}
              </Select>
              <Button variant="outlined" className="basis-0 bg-backgroundOrange hover:bg-backgroundOrange shadow-none hover:shadow-none" 
              onClick={onCreateReturn}>{selectedCount() === 0 ? 'すべてのカードを還元' : `${selectedCount()}枚カードを還元`}</Button>
              <Button  disabled={!hasSelectedItems()} variant="contained" color="primary" className="basis-0 bg-primary hover:bg-primary text-white" onClick={() => onCreateShipping()}>{selectedCount()}枚発送</Button>
            </div>
          </div>
        </footer>
      }

    <BaseDialog color="primary" isOpen={createShippingOperation.status === 'confirm'} title={"発送のご確認"} content={"選択したカードを発送してもよろしいでしょうか"} confirmLabel={"確認"} cancelLabel={"キャンセル"} onConfirm={function (): void {
      if (!createShippingOperation.payload) {
        return;
      }
      if (!createShippingOperation.payload.addressId) {
        setShowNoAddress(true);
        return;
      }
      dispatch(createShipping(createShippingOperation.payload)).finally(async () => {
        setSelected({});
        if (userProfile?.id) {
          dispatch(fetchUserProfile(userProfile?.id));
          refreshCards(userProfile.id)
        }
      })
    }} onCancel={function (): void {
      setSelected({});
      dispatch(clearOperationStatus('createShipping'))
    }} />
    <BaseDialog color="primary" isOpen={createShippingOperation.status === 'succeeded'} title={"商品の発送依頼を承りました"} content={<><p className="text-black">発送を希望した商品は10営業日〜15営業日以内で梱包、発送処理を完了します</p><p className="text-black">商品到着まで今しばらくお待ちください。</p></>} confirmLabel={"オリパページに戻る"} onConfirm={function (): void {
      dispatch(clearOperationStatus('createShipping'));
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
          refreshCards(userProfile?.id);
          dispatch(clearOperationStatus('returnItem'));
        }
      })
    }} onCancel={async function () {
      setSelected({});
      dispatch(clearOperationStatus('returnItem'))
    }} />

  </div>

  );

}
