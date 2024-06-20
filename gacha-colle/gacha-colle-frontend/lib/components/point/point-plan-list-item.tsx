'use client';

import { PrimaryButton } from "@commons/components/buttons/primary-button";

interface PointPlanListItemProps {
  point: string;
  price: string;
  onPurchase: () => void;
}

export function PointPlanListItem({ point, price, onPurchase }: PointPlanListItemProps) {
  return <li key="index" className="group p-4 my-4 bg-white flex justify-between items-center bg-slate-100 rounded text-slate-700 cursor-point" role="option" aria-selected="true">
    <img className="h-8 w-8 mr-2" src="/coins.png" />
    <div className="grow">
      <h4 className="font-semibold"> {point} points</h4>
      <h4 className="text-gray-500 text-sm">{price} 円で購入</h4>
    </div>
    
    <PrimaryButton className="bg-primary" onClick={() => onPurchase()}>
      購入する
    </PrimaryButton>
  </li>
}