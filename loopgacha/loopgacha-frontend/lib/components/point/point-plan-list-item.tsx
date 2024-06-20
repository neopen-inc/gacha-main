'use client';

import { PrimaryButton } from "@commons/components/buttons/primary-button";
import { Button } from "@mui/material";

interface PointPlanListItemProps {
  point: string;
  price: string;
  onPurchase: () => void;
}

export function PointPlanListItem({ point, price, onPurchase }: PointPlanListItemProps) {
  return <li key="index" onClick={onPurchase} className="group p-2 md:p-4 my-4 bg-white flex justify-between items-center text-secondary cursor-point border border-[#eee] rounded-lg cursor-pointer" role="option" aria-selected="true">
    <img src="/coins.png" className="h-10 pr-2" />
    <div className="grow">
      <h4 className="font-semibold text-sm md:text-lg"> {point} pt</h4>
      <h4 className="text-gray-500 text-xs md:text-sm">{price} 円で購入</h4>
    </div>
    
    <PrimaryButton size="small" className="rounded-full md:px-5 shadow-none whitespace-nowrap shrink-0" onClick={() => onPurchase()}>
      購入する
    </PrimaryButton>
  </li>
}