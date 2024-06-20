'use client'
import { useAppDispatch, useAppSelector } from "@gacha-colle-app/store/hooks";
import { getJSTDateString } from "@gacha-colle-app/util/date";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useEffect } from "react";
import { Collection, CollectionProgress } from "@gacha-colle-app/domain/types";
import { fetchCategories, fetchCollectionProgress, fetchCollections } from "@gacha-colle-app/domain/oripa/action";
import { fetchCheckinConfigs } from "@gacha-colle-app/domain/user/action/checkin.action";
import { clearOperationStatus } from "@gacha-colle-app/domain/user/store";
import { OripaCard } from "@gacha-colle-app/components/common/oripa-card";

export default function Home() {
  const dispatch = useAppDispatch();
  
  const router = useRouter();
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoryId')
  const checkinConfigs = useAppSelector(state => state.user.checkinConfigs);
  
  const [collectionProgressMap, setCollectionProgressMap] = React.useState<Record<string, CollectionProgress>>({});
  const isCollectionFinished = (collectionProgressMap: Record<string, CollectionProgress>, collectionId: string): boolean => {
    return Number((collectionProgressMap[collectionId]?.inventory || 0)) === 0
  }
  const fetchCollectionsOperation = useAppSelector(state => state.oripa.operations.fetchCollections);
  const fetchCategoriesOperation = useAppSelector(state => state.oripa.operations.fetchCategories);
  const fetchCollectionProgressOperation = useAppSelector(state => state.oripa.operations.fetchCollectionProgress);

  const checkInOperation = useAppSelector(state => state.user.operations.checkin);
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const [showStampCard, setShowStampCard] = React.useState(false);
  const [stampDays, setStampDays] = React.useState(0);

  useEffect(() => {
    dispatch(fetchCategories({ status: 'active' }));
    dispatch(fetchCheckinConfigs());
  }, []);
  useEffect(() => {
    dispatch(fetchCollections({
      ...(categoryId ? { categoryId, status: 'active' } : { status: 'active' }),
      orderby: 'seq desc, createdAt desc',
      top: 200,
    })).unwrap().then((collections) => {
      const idList = collections.data.map((collection: Collection) => collection.id).join(',');
      dispatch(fetchCollectionProgress(idList));
    });
  }, [categoryId]);
  useEffect(() => {
    if (fetchCollectionProgressOperation.payload) {
      setCollectionProgressMap(fetchCollectionProgressOperation.payload?.reduce((map, progress) => {
        map[progress.collectionId] = progress;
        return map;
      }, {} as Record<string, any>));
    }
  }, [fetchCollectionProgressOperation]);

  useEffect(() => {
    if (!userProfile?.id) {
      return;
    }    
    if (localStorage.getItem(`${userProfile?.id}-checkin`) === getJSTDateString(new Date())) {
      return;
    }
  }, [userProfile])
  useEffect(() => {
    if (!userProfile?.id) {
      return;
    }
    if (checkInOperation.status === 'succeeded' && checkInOperation.payload) {
      localStorage.setItem(`${userProfile?.id}-checkin`, checkInOperation.payload?.checkinDate);
      setShowStampCard(true);
      setStampDays(checkInOperation.payload.continues);
      clearOperationStatus('checkin');
    }
  }, [checkInOperation]);

  return <div className="w-full lg:max-w-5xl bg-white relative pb-40">
    <div className="mb-3 bg-white w-full pb-2 sticky top-0 z-20">
      <ul className="hidden-scrollbar flex flex-nowrap overflow-scroll  space-x-4 text-base text-gray-500 border-b border-solid border-gray-300">
        <li className={(!categoryId ? 'text-primary font-bold border-b-4 border-primary active ' : 'font-bold text-black') + 'hover:text-primary hover:border-primary px-3 border-solid pb-2 whitespace-nowrap'}><Link href="/" >すべて</Link></li>
        {fetchCategoriesOperation.payload?.data.map((category, index) => <li key={index} className={(category.id === categoryId ? 'text-primary font-bold border-solid border-b-4 border-primary active ' : '') + 'hover:text-primary hover:border-primary px-3 pb-2 border-solid font-bold whitespace-nowrap'} ><Link href={`/?categoryId=${category.id}`}>{category.name}</Link></li>)}
      </ul>
    </div>
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:gap-x-8  max-w-3xl mx-5 md:mx-auto">
      {
        fetchCollectionsOperation.payload?.data.map((collection, index) => 
        <OripaCard key={index} collection={collection} collectionProgress={collectionProgressMap[collection.id]} onClick={() => {
          if (isCollectionFinished(collectionProgressMap, collection.id)) {
            return ;
          }
          router.push(`/oripa/${collection.id}`);
        }} />
        )}
    </div>
  </div>
}
