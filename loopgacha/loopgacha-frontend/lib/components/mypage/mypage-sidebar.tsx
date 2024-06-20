import { User } from "@loopgacha-app/domain/types";
import { CurrencyYenIcon, FilmIcon, UserIcon, HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Hr } from "../common/hr";
import { PointBadge } from "../point-badge";
import { useRouter } from "next/navigation";

interface MypageSidebarProps {
  activePage: string;
  email: string;
  name: string;
  points: number;
  userProfile?: User;
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
function SideBarItem({ href, icon, text, activePage }: { href: string; icon: React.ReactNode; text: string; activePage: string; }) {
  return <li className={`cursor-pointer text-sm`}>
    <Link className={`py-2 md:px-2 flex justify-center md:justify-start items-center rounded-lg ${activePage === href ? "bg-primary text-white" : "hover:text-primary"}`} href={href}>
      {icon}
      <span className="hidden md:inline">{text}</span>
    </Link>
  </li>
}

export function MypageSidebar({ email,
  name,
  points,
  userProfile,
  activePage }: MypageSidebarProps) {
  const router = useRouter();
  return <aside className="h-screen w-10 md:w-48 shrink-0 sm:block md:p-4 bg-white">
    <div className="hidden md:block">
      <div className="h-16 text-primary text-xl cursor-pointer" onClick={() => router.push("/")}>
        ループガチャ
      </div>
      <div className="pb-2">
        {userProfile && <PointBadge points={userProfile.points} onClickPoint={() => {}} />}
      </div>
      <div className="text-md">
        <div className="pl-2">
          <div>{name}</div>
          <div className="text-xs text-secondary">{email}</div>
        </div>
        
      </div>
    </div>
    <div className="py-5">
      <Hr />
    </div>
    
    <nav className="text-sm text-secondary">
      <ul className="flex flex-col gap-y-2">
        <SideBarItem href="/mypage" icon={<HomeIcon className="w-5 h-5" />} text="ホーム" activePage={activePage} />
        <SideBarItem href="/mypage/items" icon={<FilmIcon className="w-5 h-5" />} text="ガチャ履歴" activePage={activePage} />
        <SideBarItem href="/mypage/account" icon={<UserIcon className="w-5 h-5" />} text="アカウント編集" activePage={activePage} />
        <SideBarItem href="/mypage/point" icon={<CurrencyYenIcon className="w-5 h-5" />} text="ポイント購入" activePage={activePage} />
      </ul>
    </nav>
  </aside>
}

/**
 * <SideBarItem href="/support" icon={<EnvelopeIcon className="w-7 h-7" />} text="お問い合わせ" activePage={activePage} />
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