'use client';

import { OutlinedButton } from "@toreca-jp-app/components/common/link/outlined-button";
import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { fetchUserProfile, setAuthInfo } from "@toreca-jp-app/domain/user";
import React from "react";
import { numberUtils } from "@common-utils";
import { MypageSidebar } from "@toreca-jp-app/components/mypage/mypage-sidebar";
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
  const activeStyle = "bg-backgroundOrange text-orange-900";
  
  
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
    <div className="">
      <div color="transparent" className="top-0 inset-0 z-10 h-max max-w-full px-2 py-0 rounded-none md:py-2 md:px-4 lg:px-8 lg:py-2 border-b border-[#eee] ">
        <div className="flex items-center justify-between text-blue-gray-900">
          <div className="flex justify-start items-center">
            <Link className="mr-8" href="/">
              <Typography
                variant="h3"
                className=" my-3 cursor-pointer py-1.5 font-medium"
              >
                <img className="h-16 md:h-16" src="/logo.png" />
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
                    <img className="lg:w-8 lg:h-8 h-6 w-6 rounded-full bg-transparent z-50 translate-x-3" src='/coins.png' alt={'coins'} />
                    <div className={`px-2 text-[12px] indent-0 font-semibold tracking-tighter text-white text-right min-w-[7rem] sm:min-w-[8rem] bg-gray-800 py-1 rounded-2xl`}>{numberUtils.formatNumberToLocaleString(userProfile.points)}p</div>
                    <PlusCircleIcon onClick={() => router.push('/mypage/items')} className="w-5 h-5 -ml-2 text-red-900"/>
                  </Link>

                </div>
                
                <UserCircleIcon  onClick={() => router.push('/mypage')} className="w-6 h-6 cursor-pointer" />
              </div>
            }
            {
              !userProfile && <OutlinedButton href="/login" label="ログイン" />
            }
          </div>
        </div>
      </div>
      <div className="flex min-h-screen ">
        <MypageSidebar activePage={pathname} />
        <div className="grow">
          {children}
        </div>
      </div>
    </div>
  </div>
}