import { BanknotesIcon, EnvelopeIcon, EnvelopeOpenIcon, FilmIcon, GiftTopIcon, RectangleGroupIcon, RectangleStackIcon, SparklesIcon, UsersIcon } from "@heroicons/react/24/solid";
import { BeakerIcon } from "@heroicons/react/24/outline";

export function AdminSidebar() {
  const isExactActive = false;
  const open = true;
  return <aside className="hidden w-64 bg-gray-800 sm:block">
    <div className="py-3 text-2xl uppercase text-center tracking-widest bg-gray-900 border-b-2 border-gray-800 mb-8">
      <a href="/" className="text-white">Gacha</a>
    </div>
    <nav className="text-sm text-gray-300">
      <ul className="flex flex-col">
      <li className="px-4 py-2 mt-2 text-xs uppercase tracking-wider text-gray-500 font-bold">カード</li>
        <li className={`px-4 cursor-pointer ${isExactActive ? 'bg-gray-500 text-gray-800' : 'hover:bg-gray-700'}`}>
          <a className="py-3 flex items-center gap-2" href="/admin/category">
            <RectangleGroupIcon className="w-5 h-5" />
            カテゴリー
          </a>
        </li>
        <li className={`px-4 cursor-pointer ${isExactActive ? 'bg-gray-500 text-gray-800' : 'hover:bg-gray-700'}`}>
          <a className="py-3 flex items-center " href="/admin/collection">
            <SparklesIcon className="w-5 h-5" />
            オリパ管理
          </a>
        </li>
        <li className={`px-4 cursor-pointer ${isExactActive ? 'bg-gray-500 text-gray-800' : 'hover:bg-gray-700'}`}>
          <a className="py-3 flex items-center gap-2" href="/admin/scene">
            <FilmIcon className="w-5 h-5" />
            演出管理
          </a>
        </li>
        <li className={`px-4 cursor-pointer ${isExactActive ? 'bg-gray-500 text-gray-800' : 'hover:bg-gray-700'}`}>
          <a className="py-3 flex items-center gap-2" href="/admin/shipping">
            <EnvelopeOpenIcon className="w-5 h-5 " />
            <span>発送管理</span>
          </a>
        </li>
        <li className={`px-4 cursor-pointer ${isExactActive ? 'bg-gray-500 text-gray-800' : 'hover:bg-gray-700'}`}>
          <a className="py-3 flex items-center gap-2" href="/admin/shipping?status=shipped">
            <EnvelopeIcon className="w-5 h-5" />
            発送済み
          </a>
        </li>
        <li className={`px-4 cursor-pointer ${isExactActive ? 'bg-gray-500 text-gray-800' : 'hover:bg-gray-700'}`}>
          <a className="py-3 flex items-center gap-2" href="/admin/point-package">
            <GiftTopIcon className="w-5 h-5" />
            ポイントパケッジ管理
          </a>
        </li>
        <li className={`px-4 cursor-pointer ${isExactActive ? 'bg-gray-500 text-gray-800' : 'hover:bg-gray-700'}`}>
          <a className="py-3 flex items-center gap-2" href="/admin/payment">
            <BanknotesIcon className="w-5 h-5" />
            支払い一覧
          </a>
        </li>
        <li className="px-4 py-2 mt-2 text-xs uppercase tracking-wider text-gray-500 font-bold">ユーザー</li>
        <li className="px-4 cursor-pointer hover:bg-gray-700">
          <a href="/admin/user" className="py-2 flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            ユーザー管理
          </a>
        </li>
        <li className="px-4 cursor-pointer hover:bg-gray-700">
          <a href="/admin/checkin-config" className="py-2 flex items-center gap-2">
            <BeakerIcon className="w-5 h-5" />
            チェックインボーナス
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