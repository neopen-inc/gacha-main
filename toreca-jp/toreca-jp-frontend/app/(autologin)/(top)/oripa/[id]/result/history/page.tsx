'use client'

import { useAppDispatch, useAppSelector } from "@toreca-jp-app/store/hooks"
import { useEffect } from "react";

export default function ResultHistoryPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.myInfo.userProfile);
  const gachaHistory = useAppSelector(state => state.oripa.gacha.history);
  const lineItems = useAppSelector(state => state.oripa.lineItem.lineItems);
  useEffect(() => {
    if (!user) return;
    //dispatch(fetchUserLineItems(user.id, ));
  }, [dispatch, user])
  return <div>
    <div className="flex flex-row space-x-1 justify-center">
      {lineItems.data.map((lineItem, index) => {
        return <div key={index} >
          <div className={`relative aspect-[9/10] w-32 flex-none overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:w-72 sm:rounded-2xl ${index % 3 === 0 ? '-rotate-2' : 'rotate-2'}`}>
            <img src={lineItem.card.thumbnail} className="w-32" />
          </div>
        </div>
      })}
    </div>
  </div>
}