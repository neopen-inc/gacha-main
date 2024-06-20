'use client';

import { OutlinedButton } from "@gacha-expo-app/components/common/link/outlined-button";
import { useAppDispatch, useAppSelector } from "@gacha-expo-app/store/hooks";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import React from "react";
import { numberUtils }  from "@common-utils";
import DrawerContent from "@gacha-expo-app/components/common/drawer-content";
import { AppBar, Drawer, Typography } from "@mui/material";
import { fetchUserProfile, setAuthInfo } from "@gacha-expo-app/domain/user/store";


export default function Layout({ children }: { children: React.ReactNode }) {
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!userProfile) {
      const accessToken = localStorage.getItem('access_token');
      const id = localStorage.getItem('user_id');
      if (id && accessToken) {
        dispatch(setAuthInfo({ token: accessToken, id }));
        dispatch(fetchUserProfile(localStorage.getItem('user_id') || '')).unwrap().then((data) => {
        });
      }
    }
  }, []);
  const [openRight, setOpenRight] = React.useState(false);
  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);
  const router = useRouter();
  return <div className={`h-screen ${openRight ? "overflow-hidden" : "overflow-scroll"}`}>
    <div className={`max-w-5xl	m-auto `}>
      <AppBar color="transparent" elevation={0} className="top-0 shadow-none inset-0 z-10 h-max max-w-full px-2 py-0 rounded-none md:py-2 md:px-4 lg:px-8 lg:py-4" position="static">
        <div className="flex items-center justify-between text-gray-900">
          <Link href="/">
            <Typography
              variant="h3"
              className="mr-4 my-3 cursor-pointer py-1.5 font-medium"
            >
              <img className="h-16 md:h-20" src="/logo.png" />
            </Typography>
          </Link>
          <div className="flex items-center gap-4">
            {
              userProfile &&
              <div className="flex justify-end space-x-1 lg:space-x-4 items-center">
                <div className="relative">
                  <Link href="/point" className="items-center flex flex-row justify-end">
                    <img className="lg:w-8 lg:h-8 h-6 w-6 rounded-full bg-transparent z-50 translate-x-3"
                     src='/coins.png'
                     style={{
                      transform: "translateX(10px)"
                     }}
                      />
                    <div className={`px-2 text-[12px] indent-0 font-semibold tracking-tighter text-white text-right min-w-[7rem] sm:min-w-[8rem] bg-gray-800 py-1 rounded-2xl`}>{numberUtils.formatNumberToLocaleString(userProfile.points)}p</div>
                    <PlusCircleIcon onClick={() => router.push('/mypage/items')} className="w-5 h-5 -ml-2 text-red-900"/>
                  </Link>
                </div>
                <UserCircleIcon onClick={openDrawerRight} className="w-6 h-6 cursor-pointer"/>
                <Drawer
                  open={openRight}
                  onClose={closeDrawerRight}
                  anchor="right"
                  SlideProps={{
                    className: "w-[80%] md:w-[50%] lg:w-[30%]"
                  }}
                >
                  <DrawerContent userProfile={userProfile} closeDrawerRight={closeDrawerRight} />
                </Drawer>
              </div>
            }
            {
              !userProfile && <OutlinedButton href="/login" label="ログイン" />
            }
            
          </div>
        </div>
      </AppBar>
      <div className="overflow-scroll">
        {children}
      </div>
    </div>
    <footer className="w-full flex flex-col justify-center items-center px-8 py-6 bg-primary text-white text-xs  border-t-2 ">
      <div className="flex flex-wrap justify-center space-x-8 mt-4 font-bold">
        <div className="plex space-x-8 item-center">
          <a href="/term" className="font-bold hover:text-gray-200">利用規約</a>
        </div>
        <div className="plex space-x-8 item-center">
          <a href="/privacy" className="font-bold hover:text-gray-200">プライバシーポリシー</a>
        </div>
        <div className="plex space-x-8 item-center">
          <a href="/law" className="font-bold hover:text-gray-200">特定商取引法に基づく表記</a>
        </div>
      </div>
      <div className="pt-3">
        ©︎ 2023 NeoPen Inc.
      </div>
    </footer>
  </div>
}