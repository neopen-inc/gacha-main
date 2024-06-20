'use client'
import { useAppSelector } from "@gacha-expo-app/store/hooks";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pageTitle = useAppSelector(state => state.page.pageTitle);
  const returnPage = useAppSelector(state => state.page.returnPage);
  const userProfile = useAppSelector(state => state.user.myInfo.userProfile);
  const router = useRouter();
  return <>
    <div className="max-w-5xl	m-auto h-screen">
      <header className="w-full h-10 flex flex-row items-center border-b border-solid border-gray-300">
        <div>
          <Button variant="text" className="flex items-center gap-2 text-gray-700" onClick={() => router.push(returnPage || '/')}>
            <ArrowLeftIcon className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
        <div>
          <Typography variant="subtitle1">{pageTitle}</Typography>
        </div>
      </header>
      <section className="flex-1 overflow-y-scroll">
        {children}
      </section>
    </div>
  </>
}