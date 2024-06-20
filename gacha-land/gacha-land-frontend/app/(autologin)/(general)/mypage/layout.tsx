'use client';

import { OutlinedButton } from "@gacha-land-app/components/common/link/outlined-button";
import { useAppDispatch, useAppSelector } from "@gacha-land-app/store/hooks";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { fetchUserProfile, setAuthInfo } from "@gacha-land-app/domain/user";
import React from "react";
import { numberUtils } from "@common-utils";
import { MypageSidebar } from "@gacha-land-app/components/mypage/mypage-sidebar";
import { AppBar, Typography } from "@mui/material";

/**
 * {
  text: 'ショップ',
  link: '/shop',
}, {
  text: 'オークション',
  link: '/auction',
},
, {
  text: 'カード売却',
  link: '/sell',
}
 */
const menuItems: { text: string; link: string }[] = [];

export default function Layout({ children }: { children: React.ReactNode }) {
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const pathname = usePathname();
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
  return <div className="flex min-h-screen ">
    <MypageSidebar activePage={pathname} email={userProfile?.email || ''} name={userProfile?.name || ''} points={Number(userProfile?.points || 0)} userProfile={userProfile} />
    
    <div className="grow bg-[#f3f3f3] lg:p-10">
      {children}
    </div>
  </div>
}