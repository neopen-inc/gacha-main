import { CurrencyYenIcon, EnvelopeIcon, FilmIcon, HomeIcon, UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface MypageSidebarProps {
  activePage: string;
}

/*
<li className={` cursor-pointer  py-1 `}>
          <a className={`py-2 px-2 flex items-center rounded-lg hover:bg-backgroundOrange hover:text-orange-900 ${activePage === '/mypage/shop' ? activeStyle : ""} `}  >
            <ShoppingCartIcon className="h-5 w-5" />
            ショップ購入履歴
          </a>
        </li>
<li className={`cursor-pointer py-1 `}>
          <Link className={` py-2 px-2 flex items-center  rounded-lg hover:bg-backgroundOrange hover:text-orange-900 ${activePage === '/mypage/items' ? activeStyle : ""} `}  href="/mypage/items">
            <TruckIcon className="h-5 w-5" />
            発送状況確認
          </Link>
        </li>
        <li className={`cursor-pointer py-1 `}>
          <a className={`py-2 px-2 flex items-center rounded-lg hover:bg-backgroundOrange hover:text-gray-900 ${activePage === '/' ? activeStyle : ""} `} >
            <CreditCardIcon className="w-5 h-5" />
            決済編集
          </a>
        </li>
        <li className={`cursor-pointer  py-1 `}>
          <a className={`py-2 px-2 flex items-center rounded-lg hover:bg-backgroundOrange hover:text-orange-900 ${activePage === '/mypage/faq' ? activeStyle : ""} `}  href="/faq">
            <QuestionMarkCircleIcon className="w-5 h-5" />
            よくある質問
          </a>
        </li>
        */

export function MypageSidebar({ activePage }: MypageSidebarProps) {
  // const isExactActive = false;
  // ${isExactActive ? 'hover:bg-backgroundOrange hover:text-orange-900' : 'hover:bg-gray-500'}
  const activeStyle = "bg-backgroundOrange text-orange-900";
  //const normal = "bg-backgroundOrange text-orange-900";
  return <aside className="w-10 md:w-48 shrink-0 sm:block md:pl-4">
    <nav className="text-sm text-gray-800">
      <ul className="flex flex-col">
        
        <li className={`cursor-pointer  py-1 `}>
          <a className={`py-2 md:px-2 flex justify-center  md:justify-start items-center rounded-lg  hover:bg-backgroundOrange hover:text-orange-900 ${activePage === '/mypage' ? activeStyle : ""} `} href="/mypage">
            <HomeIcon className="w-7 h-7" />
            <span className="hidden md:inline">ホーム</span>
          </a>
        </li>
        
        
        <li className={` cursor-pointer py-1 `}>
          <Link href="/mypage/items" className={`py-2 md:px-2 flex justify-center  md:justify-start items-center rounded-lg hover:bg-backgroundOrange hover:text-orange-900 ${activePage === '/' ? activeStyle : ""} `}  >
            <FilmIcon className="w-7 h-7" />
            <span className="hidden md:inline">ガチャ履歴</span>
            
          </Link>
        </li>
        <li className={` cursor-pointer py-1  `}>
          <Link href="/mypage/account" className={`py-2 md:px-2 flex justify-center  md:justify-start items-center rounded-lg hover:bg-backgroundOrange hover:text-orange-900 ${activePage === '/mypage/account' ? activeStyle : ""} `} >
            <UserIcon className="w-7 h-7" />
            <span className="hidden md:inline">アカウント編集</span>
          </Link>
        </li>
        <li className={`cursor-pointer  py-1 `}>
          <a className={`py-2 md:px-2 flex justify-center  md:justify-start items-center rounded-lg hover:bg-backgroundOrange hover:text-orange-900 ${activePage === '/mypage/point' ? activeStyle : ""} `}  href="/mypage/point">
            <CurrencyYenIcon className="w-7 h-7" />
            <span className="hidden md:inline">ポイント購入</span>
          </a>
        </li>
        
        <li className={`cursor-pointer py-1 `}>
          <a className={`py-2 md:px-2 flex justify-center  md:justify-start items-center rounded-lg hover:bg-backgroundOrange hover:text-gray-900 ${activePage === '/support' ? activeStyle : ""} `}  >
            <EnvelopeIcon className="w-7 h-7" />
            <span className="hidden md:inline">お問い合わせ</span>
            
          </a>
        </li>
      </ul>
    </nav>
  </aside>
}

/**
 * <li className="px-4 py-2 mt-2 text-xs uppercase tracking-wider text-gray-500 font-bold">System</li>
      <li className="px-4 cursor-pointer hover:bg-gray-700">
        <a href="/admin/setting" className="py-2 flex items-center">
          <IconSystem />
          Settings
        </a>
      </li>
      <li className="px-4 cursor-pointer hover:bg-gray-700">
        <a href="/admin/logout" className="py-2 flex items-center">
          <IconKey />
          Logout
        </a>
      </li>
 */