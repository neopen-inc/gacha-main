import { numberUtils } from "@common-utils";
import { UserCircleIcon } from "@heroicons/react/24/solid";


interface UserPointBadgeProps {
  points: number | string;
  onClickUser: () => void;
  onClickPoint: () => void;
}

export function UserPointBadge({ points, onClickPoint, onClickUser }: UserPointBadgeProps) {
  return <div className="flex justify-end space-x-1 lg:space-x-2 items-center cursor-pointer">
  <div className="relative">
    <a onClick={onClickPoint} className="items-center flex flex-row justify-end">
      <img className="lg:w-10 lg:h-10 h-10 w-10 bg-transparent z-50 translate-x-[50%] " src='/coins.png' alt={"money"} />
      <div className={`px-2 text-[12px] indent-0 font-semibold tracking-tighter text-white text-right min-w-[7rem] sm:min-w-[8rem] bg-secondary py-1 rounded-2xl`}>{numberUtils.formatNumberToLocaleString(points)}p</div>
    </a>
  </div>
  <UserCircleIcon onClick={onClickUser} className="w-7 h-7 cursor-pointer shrink-0"/>
</div>
}