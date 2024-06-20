'use client';

interface PointPlanListItemProps {
  point: string;
  price: string;
  onPurchase: () => void;
}

export function PointPlanListItem({ point, price, onPurchase }: PointPlanListItemProps) {
  return <li key="index" 
    className="group px-5 py-2 my-4 bg-white flex justify-between items-center rounded-md border-gray-300 border text-slate-700 cursor-point hover:border-2 hover:border-foregroundOrange" role="option" aria-selected="true"
    onClick={() => onPurchase()}
    >
    <div className="justify-start flex flex-row gap-2 items-center">
      <img src="/money-icon-orange.png" className="w-5 h-5" />
      <h4 className="font-semibold text-foregroundOrange"> {point}</h4>
    </div>
    <div className="">
      
      <h4 className="text-black text-lg"><span className="font-bold">{price}</span> <span className="text-xs">円(税込)</span></h4>
    </div>
    
  </li>
}