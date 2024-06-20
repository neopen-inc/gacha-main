'use client'

import { fetchCategories } from "@gacha-nango-app/domain/oripa/action/category.action";
import { fetchCollectionById, fetchCollectionProgress, fetchCollections } from "@gacha-nango-app/domain/oripa/action/collection.action";
import { CollectionProgress } from "@gacha-nango-app/domain/oripa/types/collection-progress";
import { useAppDispatch, useAppSelector } from "@gacha-nango-app/store/hooks";
import { getJSTDateString } from "@gacha-nango-app/util/date";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import './oripa.css';
import { numberUtils, types } from "@common-utils";
import { Gacha2Button } from "@gacha-nango-app/components/common/button/gacha2-button";
import { createGacha } from "@gacha-nango-app/domain/oripa/action/gacha.action";
import { Gacha } from "@gacha-nango-app/domain/oripa/types/gacha";
import { fetchSceneByGrade } from "@gacha-nango-app/domain/oripa/action/scene.action";
import { isObject, min } from "lodash";
import { fetchUserProfile,fetchCheckinConfigs } from "@gacha-nango-app/domain/user";
import { Collection } from "@gacha-nango-app/domain/oripa/types/collection";
import { fetchCards } from "@gacha-nango-app/domain/oripa/action";
import { Card } from "@gacha-nango-app/domain/types";
import { SectionTitle } from "@gacha-nango-app/components/common/title/section-title";
import { LinearProgress } from "@mui/material";

const narrowDownItems = [{
  label: 'PSA',
}, {
  label: 'BGS',
}, {
  label: '20thシークレット',
}, {
  label: 'レリーフ',
}, {
  label: '20thシークレット',
}];

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

  const checkInOperation = useAppSelector(state => state.user.operations.checkin);
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const [showStampCard, setShowStampCard] = React.useState(false);
  const [stampDays, setStampDays] = React.useState(0);
  const [grade1Cards, setGrade1Cards] = React.useState<Card[]>([]);
  const [grade2Cards, setGrade2Cards] = React.useState<Card[]>([]);
  const [showError, setShowError] = useState({ message: '', open: false });

  useEffect(() => {
    dispatch(fetchCategories({ status: 'active' }));
    dispatch(fetchCollectionById(params.id));
    dispatch(fetchCheckinConfigs());
    dispatch(fetchCollectionProgress(params.id));
    dispatch(fetchCards({collectionId: params.id, status: 'active', grade: '1'})).unwrap().then((cards) => {
      setGrade1Cards(cards.data)
    });
    dispatch(fetchCards({collectionId: params.id, status: 'active', grade: '2'})).unwrap().then((cards) => {
      setGrade2Cards(cards.data)
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
      });
    } catch (e) {
      if (isObject(e) && 'message' in e && e.message === 'Already gacha once') {
        router.push('/');
      }
      if (isObject(e) && 'message' in e && e.message === 'Not enough cards') {
        setShowError({ message: 'カードが足りません', open: true });
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
    <section className="oripa-collection  h-96 relative">
      <div className="flex justify-center mt-24 w-full">
        <div className="w-[60%] flex flex-col items-center">
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
          <div className="max-w-[60%] sm:max-w-[100%] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2 mt-8">
            <Gacha2Button type={"one"} onClick={() => {
              gacha('one')
            }} />
            <Gacha2Button type={"ten"} onClick={() => {
              gacha('ten')
            }} />
          </div>
        </div>
      </div>
    </section>
    <section className="3xl:mx-20 3xl:mt-40 mt-5 md:mt-40 mb-20">
      <SectionTitle title="PICKUP CARD" subtitle="カード結果ピックアップ" />
      <section className="mb-10">
        <div className="justify-center flex items-center p-4">
          <img src="/oripa/oripa-card-title.png" className="w-20" alt='oripa-title' />
          <div className="font-semibold">
            sssランク
          </div>
          <div className="font-semibold">
            提供率3％
          </div>
        </div>
        <div className="justify-center flex flex-row flex-wrap gap-2">
        {grade1Cards && grade1Cards.map((card, index) => {
          return <div key={index}>
            <img src={card.thumbnail} className="w-32" alt={card.name} />
          </div>
        })}
        </div>
      </section>

      <section>
        <div className="justify-center flex items-center p-4">
          <img src="/oripa/oripa-card-title.png" className="w-20" alt='oripa-card-title' />
          <div className="font-semibold">
            Sランク
          </div><br />
          <div className="text-xs">
            提供率30%
          </div>
        </div>
        <div className="justify-center flex gap-2">
        {grade2Cards && grade2Cards.map((card, index) => {
          return <div key={index}>
            <img src={card.thumbnail} className="w-28" alt={card.name} />
          </div>
        })}
        </div>
      </section>
    </section>
    <section className="text-secondary text-sm text-left p-20">
      注意事項　重要事項 <br />
      カードの状態表記は、当社の評価基準で判断し表示しております。また商品の特質状、返金や交換はできません。ご了承ください。 <br />
      ガチャを引く際は、利用規約・特商法など確認した上でプレイしてください。 <br />
    </section>
  </div>
}
