import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Typography } from "@mui/material";

export interface ResultBoxProps {
  thumbnail: string;
  name: string;
  points: string;
  grade: string;
  selected: boolean;
  onClick?: () => void;
}
export function ResultBox({ thumbnail, name, grade, points, selected, onClick }: ResultBoxProps) {
  return <div className={`flex-row  max-h-[12rem] md:max-w-[90%] max-w-[95%] justify-between rounded shadow-md  ${selected ? 'bg-gray-300' : ''}`} onClick={onClick}>
    <div className="flex justify-between  h-full">
      <div className="max-w-[40%]  h-full relative flex-none rounded-xl bg-transparent -rotate-6">
        <img src={thumbnail} alt="image" className="h-full object-cover" />
        <img src="/coins.png" alt="p" className="absolute z-10 w-8 h-8 right-0 bottom-0 -translate-y-[50%] translate-x-[30%]" />
      </div>
      <div className="p-2 md:pr-7 shrink-0 rounded-r-none relative flex flex-col text-right md:p-5 md:space-5">
        {selected && <CheckCircleIcon className="md:h-7 md:w-7 h-5 w-5 text-primary absolute right-0 top-0 md:translate-x-4 translate-x-2 md:-translate-y-4 -translate-y-2 z-10" />}
        <Typography color="black" className="text-xs font-semibold">{name}</Typography>
        <Typography color="black" className="text-xs font-semibold">{grade}</Typography>
        <Typography color="black" className="text-md text-red-700"><i className="fas fa-coins text-red-700" />{points}pt</Typography>
      </div>
    </div>
  </div>
}