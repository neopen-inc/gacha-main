'use client'
import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@gacha-land-app/store/hooks"
import { useRouter } from "next/navigation";
import { fetchUserProfile } from "@gacha-land-app/domain/user";
import { ResultBox } from "@gacha-land-app/components/common/result-box";
import { setPageTitle, setReturnPage } from "@gacha-land-app/store/page";
import store from "@gacha-land-app/store";
import _ from "lodash";
import { BaseDialog } from "@gacha-land-app/components/dialog/base-dialog";
import { LineItem } from "@gacha-land-app/domain/oripa/types/line-item";
import { clearReturnItem, fetchUserLineItems, prepareReturnItem, returnMany } from "@gacha-land-app/domain/oripa/action";
import { clearCreateShipping, createShipping, prepareCreateShipping } from "@gacha-land-app/domain/shipping/action/shipping.action";
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

  const [selectedAddress, setSelectedAddress] = React.useState<string | undefined>(undefined);
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const createReturnOperation = useAppSelector(state => state.oripa.operations.returnItem);
  const createShippingOperation = useAppSelector(state => state.shipping.operations.createShipping);
  const [showNoAddress, setShowNoAddress] = React.useState<boolean>(false);
  const refreshCards = (userId: string) => {
    dispatch(fetchUserLineItems({ userId, query: { status: 'unselected', orderby: 'updatedAt desc' } }));
    dispatch(fetchUserLineItems({ userId, query: { status: 'waiting_for_ship', orderby: 'updatedAt desc' } }));
    dispatch(fetchUserLineItems({ userId, query: { status: 'shipped', orderby: 'updatedAt desc' } }));
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
    const lineItems: types.Paginated<LineItem> = status === 'unselected' ? myLineItems.unselected :
      status === 'waiting_for_ship' ? myLineItems.waiting_for_ship : myLineItems.shipped;

    return <div className="grid gap-y-5 gap-x-2 md:gap-x-5 lg:gap-x-10 lg:gap-x-6 grid-cols-2 lg:grid-cols-2 w-full pt-5">
      {
        lineItems && lineItems.data.map((lineItem, index) =>
        lineItem.card && <ResultBox key={index} thumbnail={lineItem.card.thumbnail} name={lineItem.card.name} grade={lineItem.card.grade} points={lineItem.card.points.toString()} selected={!!selected[lineItem.id]} onClick={() => { selectable && toggleSelect(lineItem.id) }} />) 
      }
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
    <div className="relative md:w-4/5 w-full m-2 mx-auto md:pt-5">
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
            style={{color: activeTab === value ? "white" : "#00959a", background: activeTab === value ? "#00959a" : "#f5f5f5"}}
            className={`${activeTab === value ? "text-white md:font-bold bg-primary font-semibold " : "md:font-semibold text-primary bg-primary-200"} px-0 py-1 md:py-2 text-sm md:mx-2 md:rounded-md`}
          />
        ))}
      </TabList>
        {data.map(({ value }: { value: string}) => (
          <TabPanel className="p-2 lg:p-5" key={value} value={value}>
            {renderCards(value, value === 'unselected')}
          </TabPanel>
        ))}
      </TabContext>
      {
        activeTab === 'unselected' &&
          <footer className="w-full h-30 border-t-2 border-gray-300 pt-5 mt-10">
            <div className="lg:space-x-10 h-30 flex flex-col space-y-2 lg:p-5" >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 m-2">
                <div className="">
                  <span>選択ポイント</span>
                  <span>{myLineItems.unselected.data?.reduce((acc, cur) => acc + (selected[cur.id] ? cur.card.points : 0), 0)}</span>
                </div>
                <Select size="small" onChange={value => setSelectedAddress(value.target.value)} value={selectedAddress} label="郵送先">
                  {userProfile?.defaultAddress ? <MenuItem key={userProfile?.defaultAddress.id} value={userProfile?.defaultAddress.id}>〒{userProfile?.defaultAddress.postcode}-{userProfile?.defaultAddress.lastName}{userProfile?.defaultAddress.firstName}</MenuItem> : <MenuItem></MenuItem>}
                </Select>
                <Button variant="outlined" className="basis-0 col-span-2 py-2 shadow-none hover:shadow-none rounded-full" onClick={onCreateReturn}>{selectedCount() === 0 ? 'すべてのカードを還元' : `${selectedCount()}枚カードを還元`}</Button>
                <Button disabled={!hasSelectedItems()} variant="contained" className="basis-0 col-span-2 py-2 bg-primary text-white rounded-full" onClick={onCreateShipping}>{selectedCount()}枚発送</Button>
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
      dispatch(clearCreateShipping())
    }} />
    <BaseDialog color="primary" isOpen={createShippingOperation.status === 'succeeded'} title={"商品の発送依頼を承りました"} content={<><div className="text-center text-[#555]">発送を希望した商品は10営業日〜15営業日以内で</div><div>梱包、発送処理を完了します</div><div className="text-[#555]">商品到着まで今しばらくお待ちください。</div></>} confirmLabel={"ページに戻る"} onConfirm={function (): void {
      dispatch(clearCreateShipping());
    }} />
    <BaseDialog color="red" isOpen={createShippingOperation.status === 'failed'} title={"発送失敗しました"} content={<><p className="text-black">発送できませんでした</p></>} confirmLabel={"確認"} onConfirm={function (): void {
      dispatch(clearCreateShipping());
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
          dispatch(clearReturnItem());
        }
      })
    }} onCancel={async function () {
      setSelected({});
      dispatch(clearReturnItem())
    }} />
  </div>
  );
}
