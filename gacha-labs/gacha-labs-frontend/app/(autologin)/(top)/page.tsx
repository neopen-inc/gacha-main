'use client'
import React from "react";
import { useEffect } from "react";
import { fetchCategories } from "@gacha-labs-app/domain/oripa/action/category.action";
import { fetchCollectionProgress, fetchCollections } from "@gacha-labs-app/domain/oripa/action/collection.action";
import { CollectionProgress } from "@gacha-labs-app/domain/oripa/types/collection-progress";
import { Collection } from "@gacha-labs-app/domain/oripa/types/collection";
import { useAppDispatch, useAppSelector } from "@gacha-labs-app/store/hooks";
import { getJSTDateString } from "@gacha-labs-app/util/date";
import {  useRouter, useSearchParams } from "next/navigation";
import "react-responsive-carousel/lib/styles/carousel.min.css"
import { DisplayOripa } from '@gacha-labs-app/components/common/oripa/display-oripa';
import './oripa.css'
import { CategoryCard } from "@gacha-labs-app/components/common/category";
import { isNil, omitBy } from "lodash";
import { SectionTitle } from "@gacha-labs-app/components/common/title/section-title";
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
  //const collections = useAppSelector(state => state.oripa.operations.fetchCollections.payload);
  const [pickupCollections, setPickupCollections] = React.useState<Collection[]>([]);
  const [allCollections, setAllCollections] = React.useState<Collection[]>([]);
  const [pickupCollectionProgress, setPickupCollectionProgress] = React.useState<CollectionProgress[]>([]);
  const [allCollectionProgress, setAllCollectionProgress] = React.useState<CollectionProgress[]>([]);
  const collectionProgress = useAppSelector(state => state.oripa.operations.fetchCollectionProgress.payload);
  const [collectionProgressMap, setCollectionProgressMap] = React.useState<Record<string, CollectionProgress>>({});
  const [pickupCollectionProgressMap, setPickupCollectionProgressMap] = React.useState<Record<string, CollectionProgress>>({});
  const [allCollectionProgressMap, setAllCollectionProgressMap] = React.useState<Record<string, CollectionProgress>>({});
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
    dispatch(fetchCollections({status: 'active', pickup: 1, orderby: 'seq desc, createdAt desc'})).unwrap().then((collections) => {
      setPickupCollections(collections.data);
      const idList = collections.data.map((collection) => collection.id).join(',');
      dispatch(fetchCollectionProgress(idList)).unwrap().then((collectionProgress) => {
        setPickupCollectionProgress(collectionProgress);
      });
    });
    dispatch(fetchCollections({status: 'active', orderby: 'seq desc, createdAt desc'})).unwrap().then((collections) => {
      setAllCollections(collections.data);
      const idList = collections.data.map((collection) => collection.id).join(',');
      dispatch(fetchCollectionProgress(idList)).unwrap().then((collectionProgress) => {
        setAllCollectionProgress(collectionProgress);
      });
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
    setPickupCollectionProgressMap((pickupCollectionProgress || []).reduce((map, progress) => {
      map[progress.collectionId] = progress;
      return map;
    }, {} as Record<string, any>));
  }, [pickupCollectionProgress]);

  useEffect(() => {
    setAllCollectionProgressMap((allCollectionProgress || []).reduce((map, progress) => {
      map[progress.collectionId] = progress;
      return map;
    }, {} as Record<string, any>));
  }, [allCollectionProgress]);

  useEffect(() => {
    if (selectedCategoryId) {
      dispatch(fetchCollections({categoryId: selectedCategoryId, status: 'active', pickup: 1, orderby: 'seq desc, createdAt desc'})).unwrap().then((collections) => {
        setPickupCollections(collections.data);
        const idList = collections.data.map((collection) => collection.id).join(',');
        dispatch(fetchCollectionProgress(idList)).unwrap().then((collectionProgress) => {
          setPickupCollectionProgress(collectionProgress);
        });
      });
      dispatch(fetchCollections({categoryId: selectedCategoryId, status: 'active', orderby: 'seq desc, createdAt desc'}))
      .unwrap().then((collections) => {
          setAllCollections(collections.data);
          const idList = collections.data.map((collection) => collection.id).join(',');
          dispatch(fetchCollectionProgress(idList)).unwrap().then((collectionProgress) => {
            setAllCollectionProgress(collectionProgress);
          });
      });
    }
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
      background: "url('https://storage.googleapis.com/prod-gacha-labs-assets/assets/topbg.jpg')",
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      width: '100%',
    }}>
    </section>
    <div className="">
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

      <div className="flex items-center mt-10 md:mx-5 justify-start">
      <Swiper
            spaceBetween={10}
            pagination={{
              clickable: true,
              dynamicBullets: false,
            }} modules={[Pagination]}
            slidesPerView={"auto"}
          >
            {
            pickupCollections && pickupCollections.map((collection, index) => {
              return <SwiperSlide style={{
                width: '400px',
              }}><DisplayOripa key={index} oripa={collection} onClick={() => router.push(`/oripa/${collection.id}`)} collectionProgress={pickupCollectionProgressMap[collection.id]} /></SwiperSlide>
            })
            }
          </Swiper>
      </div>

    
    </section>
    <section className="mx-2 lg:mx-20 my-20">
      <SectionTitle title="GACHA LISTS" subtitle="ガチャリスト一覧" />
      <div className="grid grid-cols-1 content-center place-items-center justify-center md:grid-cols-3 mx-2 md:mx-5 lg:grid-cols-3 grow justify-start gap-2 overflow-x-auto mt-10 flex-wrap">
          {allCollections && allCollections.map((collection, index) => {
            return <DisplayOripa key={index} oripa={collection} onClick={() => router.push(`/oripa/${collection.id}`)} collectionProgress={allCollectionProgressMap[collection.id]} />
          })}
        </div>
    </section>
  </div>
}
