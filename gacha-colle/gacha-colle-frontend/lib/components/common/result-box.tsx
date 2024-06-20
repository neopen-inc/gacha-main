import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Typography } from "@mui/material";

export interface ResultBoxProps {
  thumbnail: string;
  name: string;
  points: string;
  selected: boolean;
  onClick?: () => void;
}
export function ResultBox({ thumbnail, name, points, selected, onClick }: ResultBoxProps) {
  return <div className={`flex-row max-w-[18rem] max-h-[12rem] rounded shadow-md ${selected ? 'bg-gray-100' : ''}`} onClick={onClick}>
    <div className="flex h-full">
      <div className="w-2/5 h-full relative flex-none overflow-hidden rounded-xl bg-transparent -rotate-6 p-2">
        <img src={thumbnail} alt="image" className="w-full h-full object-cover " />
      </div>
      <div className="w-3/5 p-2 lg:pr-7 shrink-0 rounded-r-none relative flex flex-col items-end text-right md:p-5 md:space-5">
        {selected && <CheckCircleIcon className="h-5 w-5 text-red-700 absolute right-0 top-0 translate-x-2 -translate-y-2 z-10" />}
        <div color="black" className="text-xs line3 ">{name}</div>
        <div className="text-xs mt-2 font-semibold flex juestify-end gap-2 items-center"><img src="/coins.png" className="h-4 w-4" /><span>{Number(points).toLocaleString()}P</span></div>
      </div>
    </div>
  </div>
}
