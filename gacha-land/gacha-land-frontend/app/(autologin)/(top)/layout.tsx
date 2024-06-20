'use client';

import { useAppDispatch, useAppSelector } from "@gacha-land-app/store/hooks";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import { fetchUserProfile, setAuthInfo } from "@gacha-land-app/domain/user/store";
import React from "react";
import { Button, Typography } from "@mui/material";
import { UserPointBadge } from "@gacha-land-app/components/user-point-badge";

const menuItems: { text: string; link: string }[] = [];

const footerItems = [{
  text: '利用規約',
  link: '/term',
}, {
  text: 'プライバシー',
  link: '/privacy',
}, {
  text: '特商法',
  link: '/law',
}]

export default function Layout({ children }: { children: React.ReactNode }) {
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const dispatch = useAppDispatch();
  const [active, setActive] = React.useState('ショップ');
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
  const closeDrawerRight = () => setOpenRight(false);
  const router = useRouter();
  return <div >
    <div className="bg-primary text-white text-sm flex flex-row justify-between leading-8 align-middle items-baseline lg:px-10 px-2">
      <div><span className="font-extralight text-xs ">トレーディングカードのガチャ　EC専門サイト</span>　<span className="font-semibold hidden lg:inline-block">ガチャランド</span></div>
    </div>
    <div className=" mx-auto">
      <div className="top-0 inset-0 z-10 h-max max-w-full px-2 py-0 rounded-none md:py-2 md:px-4 lg:px-8 lg:py-2 border-b border-[#eee] " >
        <div className="flex items-center justify-between text-blue-gray-900">
          <div className="flex justify-start items-center">
            <Link className="md:mr-8 mr-2" href="/">
              <img src="/logo.png" className="w-32" />
            </Link>
            <div>
              <div className="flex gap-8">
                {
                  menuItems.map((item, index) => {
                    return <div key={index} className="text-center text-md font-bold ">
                      <Link className={`${active === item.text ? 'text-menuOrange border-b-2 border-menuOrange' : 'text-black'} pb-1`} href={item.link}>
                        {item.text}
                      </Link>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {
              userProfile &&
              <UserPointBadge points={userProfile.points} onClickPoint={() => { router.push("/mypage/point")}} onClickUser={() => { router.push("/mypage")}} />
            }
            {
              !userProfile && <Button variant="outlined" onClick={() => router.push("/login")} >ログイン</Button>
            }
          </div>
        </div>
      </div>
      <div className="">
        {children}
      </div>
    </div>
    <footer className="flex justify-center flex-col mx-auto">
      <div className="flex justify-between px-5 gap-x-10 items-center py-5 mt-20 bg-[#333]">
        <div className="shrink-0 text-primary">
          <img src="/logo.png" className="w-32" />
        </div>
        <div className="flex flex-wrap justify-start gap-x-10 leading-loose text-white">
        {
          footerItems.map((item, index) => {
            return <div key={index} className="text-left text-sm">
              <Link className="black font-semibold" href={item.link}>
                {item.text}
              </Link>
            </div>
          })
        }
        </div>
      </div>
      <div className="text-sm text-gray-400">
        &copy; 2023 ガチャランド
      </div>
    </footer>
    
  </div>
}