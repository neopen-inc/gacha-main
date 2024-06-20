import { numberUtils } from "@common-utils";
import { Collection } from '@gacha-labs-app/domain/oripa/types/collection';
import { Card, LinearProgress } from "@mui/material";
import { CollectionProgress } from "@gacha-labs-app/domain/types";
import { CircleStackIcon } from "@heroicons/react/24/solid";

interface DisplayOripaProps {
  onClick?: () => void;
  oripa: Collection;
  collectionProgress: CollectionProgress;
}
export function DisplayOripa({ oripa , collectionProgress, onClick}: DisplayOripaProps ) {
  return <div 
    className={`${Number(collectionProgress?.inventory) === 0 ? 'grayscale' : ''} shadow-md cursor-pointer overflow-hidden max-w-[360px] m-[5px] shadow-all shrink-0`}
    onClick={onClick}
  >
    <div>
      <div className="group relative overflow-hidden flex flex-col p-2">
          <img
            className="mx-auto rounded-lg transition duration-500 group-hover:scale-105 overflow-hidden w-full "
            src={oripa.thumbnail}
            alt={oripa.name}
          />
      </div>
      <div className="m-0 px-2 bg-transparent rounded-none cursor-pointer z-10 transform" >
          <div className="inset-x-0 pb-5 mt-auto bg-transparent transition duration-300 ease-in-out  z-10">
            {
            oripa.once ? <div className="absolute block whitespace-nowrap top-0 text-primary translate-y-4 left-1/2 -translate-x-1/2 font-bold rounded-md border  px-2">
            {oripa.description}
            </div> :
            <div className="text-center ">
              <div className="relative inline-block h-5 px-4 bg-white rounded-full translate-y-1/2 z-10">
                <div className="w-full top-0 text-xs flex flex-nowrap px-2 items-center">
                  <CircleStackIcon className="w-4 h-4 text-yellow-700" />
                  <span className="mx-auto text-gray-700 font-semibold text-[14px] leading-5">{oripa.gacha1Points}</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold text-white">
                <LinearProgress 
                variant="determinate" value={collectionProgress?.progress * 100 || 0} 
                sx={{
                  height: '20px'
                }}
                color="progressFull"
                />
              </h4>
              <span className="block text-black text-center text-[14px]"><span className="text-[12px]">のこり</span>{numberUtils.formatNumberToLocaleString(collectionProgress?.inventory || 0)}/{numberUtils.formatNumberToLocaleString(collectionProgress?.initialInventory || 0)}</span>
            </div>
            }
          </div>
      </div>
    </div>
  </div>
}


//#459BA0