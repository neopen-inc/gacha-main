'use client'

import { fetchCategories } from "@gacha-land-app/domain/oripa/action/category.action";
import { fetchCollectionById, fetchCollectionProgress, fetchCollections } from "@gacha-land-app/domain/oripa/action/collection.action";
import { CollectionProgress } from "@gacha-land-app/domain/oripa/types/collection-progress";
import { useAppDispatch, useAppSelector } from "@gacha-land-app/store/hooks";
import { getJSTDateString } from "@gacha-land-app/util/date";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import './oripa.css';
import { numberUtils, types } from "@common-utils";
import { Gacha2Button } from "@gacha-land-app/components/common/button/gacha2-button";
import { createGacha } from "@gacha-land-app/domain/oripa/action/gacha.action";
import { Gacha } from "@gacha-land-app/domain/oripa/types/gacha";
import { fetchSceneByGrade } from "@gacha-land-app/domain/oripa/action/scene.action";
import { isObject, min } from "lodash";
import { fetchUserProfile,fetchCheckinConfigs } from "@gacha-land-app/domain/user";
import { Collection } from "@gacha-land-app/domain/oripa/types/collection";
import { fetchCards } from "@gacha-land-app/domain/oripa/action";
import { Card } from "@gacha-land-app/domain/types";
import { SectionTitle } from "@gacha-land-app/components/common/title/section-title";
import { LinearProgress } from "@mui/material";
import { notification } from "@commons";

export default function GachaDetailPage({params}: {
  params: {
    id: string;
  }
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [play, setPlay] = useState(false);
  const scene = useAppSelector(state => state.oripa.operations.fetchSceneByGrade.payload);
  const videoRef = useRef<HTMLVideoElement>(null);
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoryId')
  const collection = useAppSelector(state => state.oripa.operations.fetchCollectionById?.payload)
  const collectionProgress = useAppSelector(state => state.oripa.operations.fetchCollectionProgress.payload);
  const [collectionProgressMap, setCollectionProgressMap] = React.useState<Record<string, CollectionProgress>>({});
  const isCollectionFinished = (collectionProgressMap: Record<string, CollectionProgress>, collectionId: string): boolean => {
    return Number((collectionProgressMap[collectionId]?.inventory || 0)) === 0
  }
  const [g1Cnt, setG1Cnt] = React.useState(0);
  const [g2Cnt, setG2Cnt] = React.useState(0);
  const [g3Cnt, setG3Cnt] = React.useState(0);
  const [g4Cnt, setG4Cnt] = React.useState(0);
  const [g5Cnt, setG5Cnt] = React.useState(0);

  const checkInOperation = useAppSelector(state => state.user.operations.checkin);
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const [showStampCard, setShowStampCard] = React.useState(false);
  const [stampDays, setStampDays] = React.useState(0);
  const [grade1Cards, setGrade1Cards] = React.useState<Card[]>([]);
  const [grade2Cards, setGrade2Cards] = React.useState<Card[]>([]);
  const [grade3Cards, setGrade3Cards] = React.useState<Card[]>([]);
  const [grade4Cards, setGrade4Cards] = React.useState<Card[]>([]);
  const [grade5Cards, setGrade5Cards] = React.useState<Card[]>([]);
  const [showError, setShowError] = useState({ message: '', open: false });
  const [disableGacha, setDisableGacha] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories({ status: 'active' }));
    dispatch(fetchCollectionById(params.id));
    dispatch(fetchCheckinConfigs());
    dispatch(fetchCollectionProgress(params.id));
    dispatch(fetchCards({collectionId: params.id, status: 'active', grade: '1', pickup: 1, top: 1000})).unwrap().then((cards) => {
      setGrade1Cards(cards.data)
    });
    dispatch(fetchCards({collectionId: params.id, status: 'active', grade: '2', pickup: 1, top: 1000})).unwrap().then((cards) => {
      setGrade2Cards(cards.data)
    });
    dispatch(fetchCards({collectionId: params.id, status: 'active', grade: '3', pickup: 1, top: 1000})).unwrap().then((cards) => {
      setGrade3Cards(cards.data)
    });
    dispatch(fetchCards({collectionId: params.id, status: 'active', grade: '4', pickup: 1, top: 1000})).unwrap().then((cards) => {
      setGrade4Cards(cards.data)
    });
    dispatch(fetchCards({collectionId: params.id, status: 'active', grade: '5', pickup: 1, top: 1000})).unwrap().then((cards) => {
      setGrade5Cards(cards.data)
    });
    dispatch(fetchCards({collectionId: params.id, status: 'active', grade: '1', pickup: 1, top: 1})).unwrap().then((cards) => {
      setG1Cnt(cards.total)
    });
    dispatch(fetchCards({collectionId: params.id, status: 'active', grade: '2', pickup: 1, top: 1})).unwrap().then((cards) => {
      setG2Cnt(cards.total)
    });
    dispatch(fetchCards({collectionId: params.id, status: 'active', grade: '3', top: 1})).unwrap().then((cards) => {
      setG3Cnt(cards.total)
    });
    dispatch(fetchCards({collectionId: params.id, status: 'active', grade: '4', top: 1})).unwrap().then((cards) => {
      setG4Cnt(cards.total)
    });
    dispatch(fetchCards({collectionId: params.id, status: 'active', grade: '5', top: 1})).unwrap().then((cards) => {
      setG5Cnt(cards.total)
    });
  }, []);
  useEffect(() => {
    dispatch(fetchCollections({
      ...(categoryId ? { categoryId, status: 'active' } : { status: 'active' }),
      orderby: 'seq asc, createdAt desc'
    })).unwrap().then((collections: types.Paginated<Collection>) => {
      const idList = collections.data.map((collection) => collection.id).join(',');
      
    });
  }, [categoryId]);
  useEffect(() => {
    if (!collectionProgress) {
      return;
    }
    setCollectionProgressMap(collectionProgress.reduce((map, progress) => {
      map[progress.collectionId] = progress;
      return map;
    }, {} as Record<string, any>));
  }, [collectionProgress]);

  async function gacha(type: 'one' | 'ten') {
    if (!userProfile?.id) {
      return router.push("/login");
    }
    try {
      setDisableGacha(true);
      await dispatch(createGacha({
        type: type,
        collectionId: params.id,
        userId: userProfile?.id,
      }))
      .unwrap()
      .then((res: Gacha) => {
        dispatch(fetchSceneByGrade(String(min(res.lineItems.map(item => Number(item.card.grade))) || 2)))
        .unwrap().then((scene) => { 
          setPlay(true);
          dispatch(fetchUserProfile(userProfile?.id))
        })
        setDisableGacha(false);
      });
    } catch (e) {
      setDisableGacha(false);
      if (isObject(e) && 'message' in e && (typeof e.message === 'string') && e.message.includes('Already gacha once')) {
        const gachaAfter = e.message.split(':')[1];
        dispatch(notification.showNotification({
          message: `一日一回のガチャです、${gachaAfter}以降に再度お試しください。`,
          severity: 'error',
          }));
      }
      if (isObject(e) && 'message' in e && e.message === 'Not enough cards') {
        dispatch(notification.showNotification({
          message: `カードが足りませんためガチャできませんでした。`,
          severity: 'error',
          }));
      }
      if (isObject(e) && 'message' in e && e.message === 'Too many requests') {
        dispatch(notification.showNotification({
          message: `サーバーアクセスが混雑しています。しばらくしてから再度お試しください。`,
          severity: 'error',
          }));
      }
    };
  }

  
  useEffect(() => {
    if (!userProfile?.id) {
      return;
    }    
    if (localStorage.getItem(`${userProfile?.id}-checkin`) === getJSTDateString(new Date())) {
      return;
    }
    //dispatch(checkin(userProfile.id));
  }, [userProfile])
  useEffect(() => {
    if (play && videoRef.current?.src) {
      videoRef.current.play();
    }
  },[
    videoRef.current?.src,
    play
  ]);
  useEffect(() => {
    if (!videoRef.current) {
      return
    }
    videoRef.current.addEventListener("ended", (event) => {
      router.push(`/result`);
    });
  }, [videoRef]);
  useEffect(() => {
    if (!userProfile?.id) {
      return;
    }
    if (checkInOperation.status === 'succeeded' && checkInOperation.payload) {
      localStorage.setItem(`${userProfile?.id}-checkin`, checkInOperation.payload?.checkinDate);
      setShowStampCard(true);
      setStampDays(checkInOperation.payload.continues);
    }
  }, [checkInOperation]);

  return <div className="w-full max-w-5xl m-auto relative pb-16 text-center">
    <div className={play ? "fixed bg-black z-50 top-0 left-0 w-screen h-screen flex justify-center items-center " : "hidden"}>
      <video
        ref={videoRef}
        className=" max-w-screen max-h-screen h-screen object-cover"
        muted={false}
        autoPlay={false}
        playsInline
        src={scene?.url}
      />
      <button className="fixed bottom-5 right-5 px-3 py-2 bg-white text-gray-600 rounded-lg" color="white" onClick={() => {
        router.push(`/result`);
      }}> Skip</button>
    </div>
    <section className="oripa-collection  relative">
      <div className="flex justify-center mt-24 w-full">
        <div className="w-[90%] lg:w-[60%] flex flex-col items-center">
        <img className="mx-auto sm:w-min-96 rounded-lg" src={collection?.thumbnail || ''} alt={collection?.name || ''} />
          <div className="text-center w-[80%] -translate-y-1/2 ">
            <div className="relative inline-block h-5 px-4 bg-white rounded-full z-10 translate-y-1/2">
              
              <div className="w-full top-0 text-xs flex flex-nowrap px-2 items-center gap-2">
                <img src="/coins.png" className="w-5" />
                <span className="mx-auto text-gray-700 font-semibold text-[14px] leading-5">{collection?.gacha1Points}</span>
              </div>
            </div>
            <h4 className="text-xl font-semibold text-white">
              <LinearProgress 
              variant="determinate" value={collectionProgressMap[collection?.id || '']?.progress * 100 || 0} 
              sx={{
                height: '20px'
              }}
              color="progressFull"
              />
            </h4>
            <span className="block text-black text-center text-[14px]"><span className="text-[12px]">のこり</span>{numberUtils.formatNumberToLocaleString(collectionProgressMap[collection?.id || '']?.inventory || 0)}/{numberUtils.formatNumberToLocaleString(collectionProgressMap[collection?.id || '']?.initialInventory || 0)}</span>
          </div>
          <div className={`max-w-[60%] sm:max-w-[100%] mx-auto grid grid-cols-1 ${collection?.once ? '' : 'sm:grid-cols-2'} gap-2 mt-8`}>
            <Gacha2Button disabled={disableGacha} type={"one"} onClick={() => {
              gacha('one')
            }} />
            {
              !collection?.once && <Gacha2Button disabled={disableGacha} type={"ten"} onClick={() => {
                gacha('ten')
              }} />
            }
          </div>
        </div>
      </div>
    </section>
    <section className="3xl:mx-20 3xl:mt-40 mt-5 md:mt-40 mb-20">
      <SectionTitle title="PICKUP CARD" subtitle="カード結果ピックアップ" />
      {
      grade1Cards.length > 0 &&
      <section className="mb-10">
        <div className="justify-center flex items-center p-4">
          <img src="/oripa/oripa-card-title.png" className="w-20" alt='oripa-title' />
          <div className="font-semibold">
            SSランク
          </div>
        </div>
        <div className="justify-center grid grid-cols-1 gap-2 place-items-center">
        {grade1Cards && grade1Cards.map((card, index) => {
          return <div key={index}>
            <img src={card.thumbnail} className="w-32" alt={card.name} />
          </div>
        })}
        </div>
      </section>
      }
      {
      grade2Cards.length > 0 && <section className="m-10">
        <div className="justify-center flex items-center p-4">
          <img src="/oripa/oripa-card-title.png" className="w-20" alt='oripa-card-title' />
          <div className="font-semibold">
            Sランク
          </div><br />
        </div>
        <div className="justify-center grid gap-2 md:gap-10 grid-cols-2 place-items-center">
        {grade2Cards && grade2Cards.map((card, index) => {
          return <div key={index} className={`${index % 2 === 0 ? 'place-self-end' : 'place-self-start'}`}>
            <img src={card.thumbnail} className="w-28" alt={card.name} />
          </div>
        })}
        </div>
      </section>
      }
      {
      grade3Cards.length > 0 && <section className="m-10">
        <div className="justify-center flex items-center p-4">
          <img src="/oripa/oripa-card-title.png" className="w-20" alt='oripa-card-title' />
          <div className="font-semibold">
            Aランク
          </div><br />
        </div>
        <div className="justify-center grid gap-2 md:gap-10 grid-cols-2 place-items-center">
        {grade3Cards && grade3Cards.map((card, index) => {
          return <div key={index} className={`${index % 2 === 0 ? 'place-self-end' : 'place-self-start'}`}>
            <img src={card.thumbnail} className="w-28" alt={card.name} />
          </div>
        })}
        </div>
        {grade3Cards.length < g3Cnt && <div className="text-xs m-5">その他あり</div>}
      </section>
      }
      {
      grade4Cards.length > 0 &&
      <section className="m-10">
        <div className="justify-center flex items-center p-4">
          <img src="/oripa/oripa-card-title.png" className="w-20" alt='oripa-card-title' />
          <div className="font-semibold">
            Bランク
          </div><br />
        </div>
        <div className="justify-center grid gap-2 md:gap-10 grid-cols-2  place-items-center">
        {grade4Cards && grade4Cards.map((card, index) => {
          return <div key={index} className={`${index % 2 === 0 ? 'place-self-end' : 'place-self-start'}`}>
            <img src={card.thumbnail} className="w-28" alt={card.name} />
          </div>
        })}
        </div>
        {grade4Cards.length < g4Cnt && <div className="text-xs m-5">その他あり</div>}
      </section>
      }
      {
      grade5Cards.length > 0 &&
      <section className="m-10">
        <div className="justify-center flex items-center p-4">
          <img src="/oripa/oripa-card-title.png" className="w-20" alt='oripa-card-title' />
          <div className="font-semibold">
            Cランク
          </div><br />
        </div>
        <div className="justify-center grid gap-2 md:gap-10 grid-cols-2 place-items-center">
        {grade5Cards && grade5Cards.map((card, index) => {
          return <div key={index} className={`${index % 2 === 0 ? 'place-self-end' : 'place-self-start'}`}>
            <img src={card.thumbnail} className="w-28" alt={card.name} />
          </div>
        })}
        </div>
        {grade5Cards.length < g5Cnt && <div className="text-xs m-5">その他あり</div>}
      </section>
    }
    </section>
    <section className="text-secondary text-sm text-left p-20">
      注意事項　重要事項 <br />
      カードの状態表記は、当社の評価基準で判断し表示しております。また商品の特質状、返金や交換はできません。ご了承ください。 <br />
      ガチャを引く際は、利用規約・特商法など確認した上でプレイしてください。 <br />
    </section>
  </div>
}
