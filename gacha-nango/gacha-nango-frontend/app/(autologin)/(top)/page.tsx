'use client'
import React from "react";
import { useEffect } from "react";
import { fetchCategories } from "@gacha-nango-app/domain/oripa/action/category.action";
import { fetchCollectionProgress, fetchCollections } from "@gacha-nango-app/domain/oripa/action/collection.action";
import { CollectionProgress } from "@gacha-nango-app/domain/oripa/types/collection-progress";
import { useAppDispatch, useAppSelector } from "@gacha-nango-app/store/hooks";
import { getJSTDateString } from "@gacha-nango-app/util/date";
import {  useRouter, useSearchParams } from "next/navigation";
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { DisplayOripa } from '@gacha-nango-app/components/common/oripa/display-oripa';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import './oripa.css'
import { CategoryCard } from "@gacha-nango-app/components/common/category";
import { isNil, omitBy } from "lodash";
import { SectionTitle } from "@gacha-nango-app/components/common/title/section-title";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/navigation';
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';

import 'swiper/css';


export default function TopPage({}: {}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoryId')
  const categories = useAppSelector(state => state.oripa.operations.fetchCategories.payload);
  const collections = useAppSelector(state => state.oripa.operations.fetchCollections.payload);
  const collectionProgress = useAppSelector(state => state.oripa.operations.fetchCollectionProgress.payload);
  const [collectionProgressMap, setCollectionProgressMap] = React.useState<Record<string, CollectionProgress>>({});
  const isCollectionFinished = (collectionProgressMap: Record<string, CollectionProgress>, collectionId: string): boolean => {
    return Number((collectionProgressMap[collectionId]?.inventory || 0)) === 0
  }

  const checkInOperation = useAppSelector(state => state.user.operations.checkin);
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const [showStampCard, setShowStampCard] = React.useState(false);
  const [stampDays, setStampDays] = React.useState(0);

  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCategories({ status: 'active', orderby: 'seq desc' }));
    dispatch(fetchCollections({status: 'active', orderby: 'seq desc, createdAt desc'})).unwrap().then((collections) => {
      const idList = collections.data.map((collection) => collection.id).join(',');
      dispatch(fetchCollectionProgress(idList));
    });
  }, []);

  useEffect(() => {
  }, [collectionProgressMap])

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
    })).unwrap().then((collections) => {
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
    dispatch(fetchCollections(omitBy({ categoryId: selectedCategoryId, status: 'active', orderby: 'seq asc, createdAt desc' }, isNil)));
  }, [selectedCategoryId]);
  
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

  return <div className="w-full mx-auto bg-white relative pb-16 text-center">
    <div className="text-left lg:pl-10 p-5">
      <a href="/" className="underline text-primary" >ホーム</a> <span className="px-2">&gt;</span> <a>ガチャ</a>
    </div>
    <section className="aspect-[14/5]" style={{
      background: "url('/topbg.png')",
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      width: '100%',
    }}>
    </section>
    <div className="-translate-y-1/4 md:-translate-y-1/2">
      <div className="flex flex-row justify-center items-center gap-2">
        {
        categories && categories.data.map((category, index) => 
        <CategoryCard key={index} zIndex={20 - index} name={category.name} thumbnail={category.thumbnail || ''} titleImage={category.logo || ''} onClick={() => {
          setSelectedCategoryId(category.id);
        }} isActive={selectedCategoryId === category.id} />
        )
        }
      </div>
    </div>
    <section >
      <SectionTitle title="RECOMMEND GACHA" subtitle="おすすめガチャ" />

      <div className="flex items-center m-10 justify-start">
          <Swiper
            spaceBetween={10}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }} modules={[Pagination]}
            slidesPerView={"auto"}
            
          >
            {
            collections && collections.data.map((collection, index) => {
              return <SwiperSlide style={{
                width: '300px',
              }}><DisplayOripa key={index} oripa={collection} onClick={() => router.push(`/oripa/${collection.id}`)} collectionProgress={collectionProgressMap[collection.id]} /></SwiperSlide>
            })
            }
          </Swiper>
      </div>

    
    </section>
    <section className="mx-2 lg:mx-20 my-20">
      <SectionTitle title="GACHA LISTS" subtitle="ガチャリスト一覧" />
      <div className="flex grow justify-center  overflow-x-auto mt-10 flex-wrap">
          {collections && collections.data.map((collection, index) => {
            return <DisplayOripa key={index} oripa={collection} onClick={() => router.push(`/oripa/${collection.id}`)} collectionProgress={collectionProgressMap[collection.id]} />
          })}
        </div>
    </section>
    
  </div>
}


/*
        <Carousel 
          showStatus={false}
          infiniteLoop={true}
          showIndicators={false}
          centerSlidePercentage={20}
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
          return <DisplayOripa key={index} oripa={collection} onClick={() => router.push(`/oripa/${collection.id}`)} collectionProgress={collectionProgressMap[collection.id]} />
        })}
        </Carousel>
        */