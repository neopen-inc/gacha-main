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
        <img src={thumbnail} alt="image" className="w-full object-cover " />
      </div>
      <div className="w-3/5 p-2 lg:pr-7 shrink-0 rounded-r-none relative flex flex-col text-right md:p-5 md:space-5">
        {selected && <CheckCircleIcon className="h-5 w-5 text-yellow-700 absolute right-0 top-0 translate-x-2 -translate-y-2 z-10" />}
        <Typography color="black" className="text-xs font-semibold whitespace-wrap">{name}</Typography>
        <Typography color="black" className="text-xs font-semibold"><i className="fas fa-coins text-yellow-900" />{points}P</Typography>
      </div>
    </div>
  </div>
}