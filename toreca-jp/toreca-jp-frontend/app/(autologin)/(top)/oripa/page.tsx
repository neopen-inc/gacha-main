'use client'
import { fetchCategories } from "@toreca-jp-app/domain/oripa/action/category.action";
import { fetchCollectionProgress, fetchCollections } from "@toreca-jp-app/domain/oripa/action/collection.action";
import { CollectionProgress } from "@toreca-jp-app/domain/oripa/types/collection-progress";
import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks";
import { getJSTDateString } from "@toreca-jp-app/util/date";
import {  useRouter, useSearchParams } from "next/navigation";
import "react-responsive-carousel/lib/styles/carousel.min.css"
import React from "react";
import { useEffect } from "react";
import { DisplayOripa } from '@toreca-jp-app/components/common/oripa/display-oripa';
import { Carousel } from "react-responsive-carousel";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import './oripa.css'
import { CategoryCard } from "@toreca-jp-app/components/common/category";
import { Gacha1Button } from "@toreca-jp-app/components/common/button/gacha1-button";
import { numberUtils, types } from "@common-utils";
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

export default function OripaPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoryId')
  const collections = useAppSelector(state => state.oripa.operations.fetchCollections.payload);
  const categories = useAppSelector(state => state.oripa.operations.fetchCategories.payload);
  const collectionProgress = useAppSelector(state => state.oripa.operations.fetchCollectionProgress.payload);
  const [collectionProgressMap, setCollectionProgressMap] = React.useState<Record<string, CollectionProgress>>({});
  const isCollectionFinished = (collectionProgressMap: Record<string, CollectionProgress>, collectionId: string): boolean => {
    return Number((collectionProgressMap[collectionId]?.inventory || 0)) === 0
  }

  const checkInOperation = useAppSelector(state => state.user.operations.checkin);
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const [showStampCard, setShowStampCard] = React.useState(false);
  const [stampDays, setStampDays] = React.useState(0);

  useEffect(() => {
    dispatch(fetchCategories({ status: 'active' }));
    dispatch(fetchCollections({status: 'active', orderby: 'seq asc, createdAt desc'})).unwrap().then((collections: types.Paginated<Collection>) => {
      const idList = collections.data.map((collection) => collection.id).join(',');
      dispatch(fetchCollectionProgress(idList));
    });
    //dispatch(fetchCheckinConfigs({}));
  }, []);

  const arrowStyle = {
    position: 'absolute' as const,
    zIndex: 2,
    top: 'calc(50% - 15px)',
    width: 30,
    height: 30,
    cursor: 'pointer' as const,
  };

  useEffect(() => {
    dispatch(fetchCollections({
      ...(categoryId ? { categoryId, status: 'active' } : { status: 'active' }),
      orderby: 'seq asc, createdAt desc'
    })).unwrap().then((collections: types.Paginated<Collection>) => {
      const idList = collections.data.map((collection) => collection.id).join(',');
      dispatch(fetchCollectionProgress(idList));
    });
  }, [categoryId]);
  useEffect(() => {
    setCollectionProgressMap((collectionProgress || []).reduce((map, progress) => {
      map[progress.collectionId] = progress;
      return map;
    }, {} as Record<string, any>));
  }, [collectionProgress]);

  
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
    if (!userProfile?.id) {
      return;
    }
    if (checkInOperation.status === 'succeeded' && checkInOperation.payload) {
      localStorage.setItem(`${userProfile?.id}-checkin`, checkInOperation.payload?.checkinDate);
      setShowStampCard(true);
      setStampDays(checkInOperation.payload.continues);
    }
  }, [checkInOperation]);

  return <div className="w-full bg-white relative pb-16 text-center">
    <section style={{
      background: "url('/topbg.png')",
      width: '100%',
      height: 300,
    }}>
      <div className="absolute top-4 pl-5 text-white border-r rounded-r-full bg-breadred py-3 pr-2">
      トレカジャパン！（カードガチャ）
      </div>
    </section>

    <div className="-translate-y-1/2" 
    style={{
      transform: 'translateY(-50%)',
    }}
    >
      <div className="flex flex-row justify-center items-center ">
        {
        categories && categories.data.map((category, index) => 
        <CategoryCard key={index} zIndex={20 - index} name={category.name} thumbnail={category.thumbnail} titleImage={category.logo}  />
        )
        }
      </div>
    </div>
    <section className="">
      <div className="text-center font-bold">
        おすすめガチャ順
      </div>
      <div>
        <Carousel 
          showStatus={false}
          infiniteLoop={true}
          showIndicators={false}
          renderArrowPrev={(clickHandler: () => void, hasPrev: boolean, label: string) => {
            return <div onClick={clickHandler} style={{...arrowStyle, left: 15}}>
              <ArrowLeftCircleIcon className="h-8 w-8 text-red-300" />
            </div>
          }}
          renderArrowNext={(clickHandler: () => void, hasPrev: boolean, label: string) => {
            return <div onClick={clickHandler} style={{...arrowStyle, right: 15}}>
              <ArrowRightCircleIcon className="h-8 w-8 text-red-300" />
            </div>
          }}
          renderItem={(item: React.ReactNode, options?: { isSelected: boolean }) => {
            return <div className="text-center mx-auto py-10 oripa-carousel">
              <div className="lg:w-[30vw] w-[50vw] min-w-[320px] mx-auto opacity-100">
                {item}
              </div>
              
            </div>
          }}
        >
          {collections && collections.data.map((collection, index) => {
          return <div className="cursor-pointer" key={index} onClick={() => {
            router.push(`/oripa/${collection.id}`)
          }}>
          <img src={collection.thumbnail} />
          <div className="flex justify-center flex-wrap -translate-y-[50%]">
            <div className="rounded-full bg-white py-2 px-3 text-xs font-semibold translate-y-[20%] z-10">
              ガチャ枚数：{numberUtils.formatNumberToLocaleString(collectionProgressMap[collection.id]?.initialInventory)}枚<span className="text-red-700">（残り{numberUtils.formatNumberToLocaleString(collectionProgressMap[collection.id]?.inventory)}枚）</span>
            </div>
            <Gacha1Button onClick={()=> {}} />
          </div>
      </div>
        })}
        </Carousel>
        
      </div>
      
    
    </section>
    <section className="mx-20 my-20">
      <div className="text-center font-bold px-8">
        ガチャリスト一覧
      </div>
      <div className="py-8 flex flex-wrap gap-4 justify-left">
        {collections && collections.data.map((collection, index) => {
          return <DisplayOripa key={index} oripa={collection} onClick={() => router.push(`/oripa/${collection.id}`)} />
        })}
        
      </div> 
    </section>
    
  </div>
}
