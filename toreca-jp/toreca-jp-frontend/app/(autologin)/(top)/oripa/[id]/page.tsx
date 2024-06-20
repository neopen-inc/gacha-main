'use client'

import { fetchCategories } from "@toreca-jp-app/domain/oripa/action/category.action";
import { fetchCollectionById, fetchCollectionProgress, fetchCollections } from "@toreca-jp-app/domain/oripa/action/collection.action";
import { CollectionProgress } from "@toreca-jp-app/domain/oripa/types/collection-progress";
import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks";
import { getJSTDateString } from "@toreca-jp-app/util/date";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import './oripa.css';
import { numberUtils, types } from "@common-utils";
import { Gacha2Button } from "@toreca-jp-app/components/common/button/gacha2-button";
import { createGacha } from "@toreca-jp-app/domain/oripa/action/gacha.action";
import { fetchCardToOripaByCollection } from "@toreca-jp-app/domain/oripa/action/card-to-oripa.action";
import { CardToOripa } from "@toreca-jp-app/domain/oripa/types/card-to-oripa";
import { Gacha } from "@toreca-jp-app/domain/oripa/types/gacha";
import { fetchSceneByGrade } from "@toreca-jp-app/domain/oripa/action/scene.action";
import { isObject, max, min } from "lodash";
import { fetchUserProfile,fetchCheckinConfigs } from "@toreca-jp-app/domain/user";
import { Collection } from "@toreca-jp-app/domain/oripa/types/collection";

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
  const [grade1Cards, setGrade1Cards] = React.useState<CardToOripa[]>([]);
  const [grade2Cards, setGrade2Cards] = React.useState<CardToOripa[]>([]);
  const [showError, setShowError] = useState({ message: '', open: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    dispatch(fetchCategories({ status: 'active' }));
    dispatch(fetchCollectionById(params.id));
    dispatch(fetchCheckinConfigs());
    dispatch(fetchCardToOripaByCollection({collectionId: params.id, cardListDto: {status: 'active', grade: '1'}})).unwrap().then((cards) => {
      setGrade1Cards(cards.data)
    });
    dispatch(fetchCardToOripaByCollection({collectionId: params.id, cardListDto: {status: 'active', grade: '2'}})).unwrap().then((cards) => {
      setGrade2Cards(cards.data)
    });
    dispatch(fetchCollectionProgress(params.id));
  }, []);
  useEffect(() => {
    const updateHeight = () => {
      let innerContainerHeight = 96 * 2;
      let outContainerHeight = 0;
      if (containerRef.current) {
        Array.from(containerRef.current.children).forEach(child => {
          innerContainerHeight += (child as any).offsetHeight || 0;
        });
        
        containerRef.current.style.height = `${innerContainerHeight}px`;
      }
      
      outContainerHeight = 0;
      if (wrapperRef.current) {
        Array.from(wrapperRef.current.children).forEach(child => {
          outContainerHeight += (child as any).offsetHeight || 0;
        });
        
        wrapperRef.current.style.height = `${outContainerHeight}px`;
      }
    };

    updateHeight();
    // Optionally, handle resize events or other triggers to recalculate
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  useEffect(() => {
    setCollectionProgressMap((collectionProgress || []).reduce((map, progress) => {
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
        dispatch(fetchSceneByGrade(String(max(res.lineItems.map(item => Number(item.cardToOripa.grade))) || 2)))
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
      router.push(`/oripa/${params.id}/result`);
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

  return <div className="w-full  relative pb-16 text-center">
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
        router.push(`/oripa/${params.id}/result`);
      }}> Skip</button>
    </div>
    <section className="oripa-collection h-96 relative" ref={wrapperRef}>
      <div className="absolute top-4 flex rounded-r-full" 
      style={{
        'boxShadow': '3px 0px 10px #D48A86',
      }}>
        <div className="pl-2 lg:pl-5 text-sm lg:text-md text-white border-r rounded-r-full bg-breadred py-3 pr-2 z-20">
        トレカジャパン！
        </div>
        <div className="pl-20 text-sm lg:text-md text-black border-r rounded-r-full bg-breadyellow py-3 pr-5 z-10 -ml-16">
          ガチャ詳細
        </div>
      </div>
      
      <div className="absolute mt-24 w-full"  ref={containerRef}>
        <div className="absolute top-0 left-[5%] z-10 lg:left-[50%] lg:-translate-x-96 w-40 px-2 py-2 leading-loose text-white text-left bg-orange-400 text-xs rounded-md">
          <div>必要コイン（１回）</div>
          <div className="flex flex-row gap-1">
            <div className="w-4 h-4" style={{
              background: 'url("/money-icon-white.png")',
              backgroundSize: 'cover'
            }} />
            <span>{numberUtils.formatNumberToLocaleString(collection?.gacha1Points)}</span>
          </div>
        </div>
        <div className="absolute top-20 left-[5%] z-10 lg:left-[50%] lg:-translate-x-96 w-40 px-2 py-2 leading-loose text-black bg-white font-bold text-left text-[9px] rounded-md">
          <div>カード枚数：{numberUtils.formatNumberToLocaleString(collectionProgressMap[collection?.id || '']?.initialInventory)}<span className="text-red-800">(残り{numberUtils.formatNumberToLocaleString(collectionProgressMap[collection?.id || '']?.inventory)}枚)</span></div>
        </div>
        <div className="absolute sm:left-[50%] sm:-translate-x-[50%] ">
          <img className="w-[90%] mx-auto sm:w-96 rounded-lg" src={collection?.thumbnail || ''} alt={collection?.name || ''} />
          <div className="max-w-[90%] sm:max-w-[90%] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2 mt-8">
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
    <section className="3xl:mx-20 3xl:mt-32 mt-5 md:mt-20 mb-20">
    <img src={collection?.subImages} className="w-full" />
      
    </section>
  </div>
}
