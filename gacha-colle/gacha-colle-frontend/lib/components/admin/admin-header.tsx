'use client';
import { User } from "@gacha-colle-app/domain/types";
import { useAppDispatch } from "@gacha-colle-app/store/hooks";
import { logout } from "@gacha-colle-app/domain/user";
import { Menu } from "@headlessui/react"
import { useRouter } from "next/navigation";

export interface AdminHeaderProps {
  userProfile: User;
}

export function AdminHeader({ userProfile }: AdminHeaderProps) {
  const active = false;
  const router = useRouter();
  const dispatch = useAppDispatch();

  return <header className="flex justify-between bg-white border-b-2 px-4 sm:justify-end sm:px-6">
    <button className="sm:hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center space-x-2 px-2 py-3 text-sm hover:bg-gray-200 focus:outline-none">
        <span>{userProfile.name}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </Menu.Button>

      <Menu.Items
        className="
          origin-top-right
          absolute
          right-0
          w-48
          shadow-lg
          py-1
          bg-white
          ring-1 ring-black ring-opacity-5
          divide-y divide-gray-200
          focus:outline-none
        "
      >
        <Menu.Item >
          <a
            onClick={() => {
              dispatch(logout(window.localStorage)).then(() => router.push('/login'));
            }}
            className={`block px-4 py-2 text-sm text-gray-700 cursor-pointer ${active ? 'bg-gray-200' : ''}`}
          >ログアウト</a>
        </Menu.Item>
      </Menu.Items>

    </Menu>
  </header >
}