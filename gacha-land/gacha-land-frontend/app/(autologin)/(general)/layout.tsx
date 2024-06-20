'use client'
import { useAppSelector } from "@gacha-land-app/store/hooks";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pageTitle = useAppSelector(state => state.page.pageTitle);
  const returnPage = useAppSelector(state => state.page.returnPage);
  const router = useRouter();
  return <>
    {children}
  </>
}

/***
 <div className="max-w-5xl	m-auto">
      <header className="w-full h-12 flex flex-row items-center space-x-2  border-b border-solid border-gray-300">
        <div>
          <Button variant="text" className="flex items-center gap-2 text-gray-700" onClick={() => router.push(returnPage || '/')}>
            <ArrowLeftIcon className="h-5 w-5" strokeWidth={2} />
          </Button>
        </div>
        <div>
          <Typography variant="h6">{pageTitle}</Typography>
        </div>
      </header>
      <section className="flex-1 overflow-y-scroll">
        {children}
      </section>
    </div>
 */