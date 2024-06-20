import { numberUtils } from "@common-utils";

interface UserPointBadgeProps {
  points: number | string;
  onClickPoint: () => void;
}

export function PointBadge({ points, onClickPoint }: UserPointBadgeProps) {
  return <div className="flex justify-start items-center cursor-pointer">
  <div className="relative">
    <a onClick={onClickPoint} className="items-center flex flex-row">
      <img className="lg:w-10 lg:h-10 h-10 w-10 bg-transparent z-50 " src='/coins.png' alt={"money"} />
      <div className={`px-2 text-[12px] indent-0 font-semibold -translate-x-5 tracking-tighter text-white text-right min-w-[7rem] sm:min-w-[8rem] bg-secondary py-1 rounded-2xl`}>{numberUtils.formatNumberToLocaleString(points)}p</div>
    </a>
  </div>
</div>
}