'use client';

import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useRouter } from 'next/navigation'
import { fetchUserProfile, setAuthInfo } from "@toreca-jp-app/domain/user";
import React from "react";
import { numberUtils } from "@common-utils";
import { AppBar, Button, Typography } from "@mui/material";

/*
{
  text: 'ガチャ',
  link: '/oripa',
}
*/

const menuItems: { text: string; link: string }[] = [];

const footerItems = [{
  text: '特商法',
  link: '/law',
}, {
  text: 'プライバシーポリシー',
  link: '/privacy',
}, {
  text: '利用規約',
  link: '/term',
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
  const router = useRouter();
  return <div >
    <div className="bg-topblue text-white text-sm flex flex-row justify-between leading-8 align-middle items-baseline lg:px-10 px-2">
      <div><span className="font-extralight text-xs ">トレーディングカードのガチャ　EC専門サイト</span>　<span className="font-semibold hidden lg:inline-block">トレカジャパン</span></div>
    </div>
    <div className="max-w-5xl mx-auto">
      <div color="transparent"  className="top-0 inset-0 z-10 h-max max-w-full px-2 py-0 rounded-none md:py-2 md:px-4 lg:px-8 lg:py-2 border-b border-[#eee] ">
        <div className="flex items-center justify-between text-blue-gray-900">
          <div className="flex justify-start items-center">
            <Link className="md:mr-8 mr-2" href="/">
              <Typography
                variant="h3"
                className="cursor-pointer py-1 font-medium"
              >
                <img className="h-16 md:h-16" src="/logo.png" alt={"logo"} />
              </Typography>
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
              <div className="flex justify-end space-x-1 lg:space-x-4 items-center">
                <div className="relative">
                  <Link href="/mypage/point" className="items-center flex flex-row justify-end">
                    <img className="lg:w-5 lg:h-5 h-5 w-5 bg-transparent z-50 translate-x-[150%] " src='/money-icon-white.png' alt={"money"} />
                    <div className={`px-2 text-[12px] indent-0 font-semibold tracking-tighter text-white text-right min-w-[7rem] sm:min-w-[8rem] bg-foregroundOrange py-1 rounded-2xl`}>{numberUtils.formatNumberToLocaleString(userProfile.points)}p</div>
                  </Link>
                </div>
                <UserCircleIcon onClick={() => router.push('/mypage')} className="w-6 h-6 cursor-pointer text-primary"/>
                
              </div>
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
    <footer className="max-w-5xl mx-auto flex justify-between px-5 gap-x-10 items-center py-5 mt-20">
      <div className="flex flex-wrap flex-col justify-start gap-x-10 leading-loose">
      {
        footerItems.map((item, index) => {
          return <div key={index} className=" text-left text-sm">
            <Link className="black font-semibold" href={item.link}>
              {item.text}
            </Link>
          </div>
        })
      }
      </div>
      <div className="shrink-0">
        <img className="h-16 w-16" src="/square.png" alt={"logo"} />
      </div>
    </footer>
  </div>
}