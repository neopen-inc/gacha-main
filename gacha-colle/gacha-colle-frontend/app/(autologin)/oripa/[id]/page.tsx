'use client';

import { User, Collection, CollectionProgress, Gacha } from "@gacha-colle-app/domain/types";
import { createGacha, fetchCollectionById, fetchCollectionProgress, fetchSceneByGrade } from "@gacha-colle-app/domain/oripa/action";
import { useAppDispatch, useAppSelector } from "@gacha-colle-app/store/hooks";
import { ArrowUturnLeftIcon, CircleStackIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react"
import { isObject, min } from "lodash";
import Link from "next/link";
import React from "react";
import DrawerContent from "@gacha-colle-app/components/common/drawer-content";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { numberUtils } from "@common-utils";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Drawer, LinearProgress, Typography } from "@mui/material";
import { fetchUserProfile } from "@gacha-colle-app/domain/user/store";
import { notification } from "@commons";
import { PrimaryButton } from "@commons/components/buttons/primary-button";

export default function OripaPage({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [playVariable, setPlayVariable] = useState({
    play: false,
    url: ''
  });
  const [isChargeDialogOpen, setIsChargeDialogOpen] = useState(false)
  const user = useAppSelector(state => state.user.myInfo.userProfile);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [openRight, setOpenRight] = React.useState(false);
  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);
  const [alreadyGacha, setAlreadyGacha] = useState(false);
  const fetchCollectionProgressOperation = useAppSelector(state => state.oripa.operations.fetchCollectionProgress);
  const [collectionProgressMap, setCollectionProgressMap] = React.useState<Record<string, CollectionProgress>>({});
  const fetchCollectionByIdOperation = useAppSelector(state => state.oripa.operations.fetchCollectionById);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  useEffect(() => {
    dispatch(fetchCollectionById(id)).unwrap().then(() => {
    }).catch((e) => {
      router.push('/');
    });
    dispatch(fetchCollectionProgress(id));
    setPlayVariable({
      play: false,
      url: ''
    });
    addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (fetchCollectionProgressOperation.payload) {
      setCollectionProgressMap(fetchCollectionProgressOperation.payload.reduce((map, progress) => {
        map[progress.collectionId] = progress;
        return map;
      }, {} as Record<string, any>));
    }
  }, [fetchCollectionProgressOperation]);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };
  
  const getOripaWindowSize = useCallback(function(): number {
    return Math.min(dimensions.width, 1024, dimensions.height * 0.6);
  }, [dimensions]);
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }
    addEventListener('resize', handleResize);
    return () => removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (playVariable.play && videoRef.current?.src) {
      videoRef.current.play();
    }
  },[
    videoRef.current?.src,
    playVariable.play
  ]);
  useEffect(() => {
    if (!videoRef.current) {
      return
    }
    videoRef.current.addEventListener("ended", (event) => {
      router.push('/result');
    });
  }, [videoRef]);
  const gacha = async (user: User | undefined, collection: Collection, type: 'one' | 'ten') => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (type === 'one' && Number(user.points) < collection.gacha1Points) {
      setIsChargeDialogOpen(true);
      return;
    }
    if (type === 'ten' && Number(user.points) < collection.gacha10Points) {
      setIsChargeDialogOpen(true);
      return;
    }
    setAlreadyGacha(true);
    try {
      await dispatch(createGacha({ userId: user.id, collectionId: collection.id, type }))
      .unwrap()
      .then((res: Gacha) => {
        dispatch(fetchSceneByGrade(String(min(res.lineItems.map(item => Number(item.card.grade))) || 4)))
        .unwrap().then((scene) => { 
          setPlayVariable({
            play: true,
            url: scene.url
          });
          dispatch(fetchUserProfile(user.id))
        })
      }).catch((e) => {
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
      });
    } catch (e) {
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
  };
  
  return <div className="w-full flex flex-row justify-center">
    <div className={playVariable.play ? "fixed  z-50 w-screen h-screen flex justify-center items-center bg-black" : "hidden"}>
      <video
        ref={videoRef}
        className="max-w-screen max-h-screen h-screen object-cover"
        muted={false}
        autoPlay={false}
        playsInline={true}
        src={playVariable.url}
      />
      <button className="fixed bottom-5 right-5 px-3 py-2 bg-white text-gray-600 rounded-lg" color="white" onClick={() => {
        router.push('/result');
      }}>Skip</button>
    </div>
    <div style={{ height: `${dimensions.height}px`, width: `${getOripaWindowSize()}px`  }} >
      <div className="block sticky top-0 w-full h-screen -z-50">
        <img src={fetchCollectionByIdOperation.payload?.background} className="w-full" />
      </div>
      <div className="z-10">
        <img src={fetchCollectionByIdOperation.payload?.subImages} className="w-full" />
      </div>
      
      <div className="fixed flex top-0 space-between justify-between items-baseline px-2 py-2" style={{ width: `${getOripaWindowSize()}px`  }}>
        <Button onClick={() => router.push("/")} size="small" variant="contained" color="secondary" className=" z-10 flex items-center gap-3 hover:shadow-none shadow-none"><ArrowUturnLeftIcon strokeWidth={2} className="h-5 w-5" />戻る</Button>
        {user && <div className="relative flex items-center">
        <Link href="/point" className="items-center flex flex-row justify-end">
          <img className="lg:w-8 lg:h-8 h-6 w-6 rounded-full bg-transparent z-50 translate-x-3" src='/coins.png' />
          <div className={`px-2 text-[12px] indent-0	font-semibold tracking-tighter text-white text-right min-w-[7rem] sm:min-w-[8rem] bg-gray-800 py-1 rounded-2xl`}>{numberUtils.formatNumberToLocaleString(user.points)}p</div>
          <PlusCircleIcon onClick={() => router.push('/mypage/items')} className="w-5 h-5 -ml-2 text-red-900"/>
        </Link>
          <UserCircleIcon className="h-6 w-6 lg:h-8 lg:w-8 mx-1 lg:mx-5" onClick={openDrawerRight} />
          
          <Drawer
            open={openRight}
            onClose={closeDrawerRight}
            className="p-2"
          >
            <DrawerContent userProfile={user} closeDrawerRight={closeDrawerRight} />
          </Drawer>
        </div>
        }
      </div>

      <div className="fixed bottom-0 bg-kawashy-light px-5 py-3 pt-2 opacity-90 flex flex-col justify-center bg-white" style={{  width: `${getOripaWindowSize()}px`  }}>
          <div className="relative -translate-y-4 h-20 ">
            {
              fetchCollectionByIdOperation.payload?.once ? 
              <div className="absolute block text-primary whitespace-nowrap top-0 translate-y-4 left-1/2 -translate-x-1/2 font-bold rounded-md border border-primary px-2">
                {fetchCollectionByIdOperation.payload?.description}
              </div> : 
              <div className="w-full h-full relative">
                <svg className="absolute block h-5 w-20 top-0 left-[50%] transform " 
                style={{
                  translate: '-50% 0%'
                }}
                viewBox="0 0 450 100" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="50,0 400,0 450,50 400,100 50,100 0,50" style={{ fill: 'white', stroke: '#666', strokeWidth: 3 }} />
                </svg>
                <div style={{
                  translate: '-50% 0%'
                }} className="absolute top-0 w-20 left-1/2 transform text-xs flex flex-nowrap px-2 justify-between items-center">
                  <img className="w-4 h-4 " src="/coins.png" />
                  <span className="mx-auto text-gray-700 font-semibold text-[14px] leading-5">{fetchCollectionByIdOperation.payload?.gacha1Points}</span>
                </div>
                <div className="absolute top-6 w-full">
                  <h4 className="text-xl font-semibold text-white">
                  {fetchCollectionByIdOperation.payload && <LinearProgress className="rounded-none"
                  value={collectionProgressMap[id]?.progress * 100 || 0} 
                  variant="determinate"
                    sx={{
                      height: '10px'
                    }}
                    />}
                  </h4>
                  {
                    fetchCollectionByIdOperation.payload &&
                    <span className="block text-black text-center text-[14px]"><span className="text-[12px]">のこり</span>{numberUtils.formatNumberToLocaleString(collectionProgressMap[fetchCollectionByIdOperation.payload?.id]?.inventory || 0)}/{numberUtils.formatNumberToLocaleString(collectionProgressMap[fetchCollectionByIdOperation.payload?.id]?.initialInventory || 0)}</span>
                  }
                </div>
              </div>
            }
            
          </div>
          <div className="flex flex-row items-center justify-center space-x-2" style={{ maxWidth: 'inherit' }}>
          <Button className=" basis-36 px-2 py-3" color="primary" variant="outlined" disabled={alreadyGacha} onClick={(event) => {
            fetchCollectionByIdOperation.payload && 
            gacha(user, fetchCollectionByIdOperation.payload, 'one')
          }}>ガチャる</Button>
          {!fetchCollectionByIdOperation.payload?.once  && <PrimaryButton className="basis-36 px-2 py-3" disabled={alreadyGacha} onClick={(event) => {
            fetchCollectionByIdOperation.payload && gacha(user, fetchCollectionByIdOperation.payload, 'ten')
          }}>１０連ガチャ</PrimaryButton>}
          </div>
        </div>
        
      <Dialog open={isChargeDialogOpen} onClose={() => setIsChargeDialogOpen(false)}>
        <DialogTitle>
          <Typography variant="h5" color="gray">
            ポイントが足りません
          </Typography>
        </DialogTitle>
        <DialogContent className="grid place-items-center gap-4">
          <Typography className="text-left font-normal">
            ガチャを回すためにはポイントが必要です。 ポイントはポイント購入ページでチャージすることができます。
          </Typography>
        </DialogContent>
        <DialogActions className="space-x-2">
          <Button variant="text" onClick={() => setIsChargeDialogOpen(false)}>
            ガチャを中止する
          </Button>
          <Button onClick={() => router.push('/point')}>
            ポイントを購入する
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    
  </div>
}