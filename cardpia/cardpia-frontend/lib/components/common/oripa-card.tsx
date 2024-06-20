import { numberUtils } from "@common-utils";
import { Collection, CollectionProgress } from "@cardpia-app/domain/types";
import { CircleStackIcon } from "@heroicons/react/24/solid";
import { Card, CardContent, LinearProgress } from "@mui/material";

const styles = {
  cardcontent: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0
    }
  }
};

export interface OripaCardProps {
  collection: Collection;
  collectionProgress: CollectionProgress;
  onClick?: () => void;
}

export function OripaCard({ collection, collectionProgress, onClick }: OripaCardProps) {
  return <Card 
    className={`${Number(collectionProgress?.inventory) === 0 ? 'grayscale' : ''} cursor-pointer overflow-hidden aspect-[5/4] md:w-max-[360px] w-[calc(100%-10px)] m-[5px] shadow-all`}
    onClick={onClick}
  >
    <div>
      <div className="group relative overflow-hidden flex flex-col">
          <img
            className="mx-auto rounded-xl transition duration-500 group-hover:scale-105 overflow-hidden w-full aspect-[3/2] object-top"
            src={collection.thumbnail}
            alt={collection.name}
            loading="lazy"
          />
      </div>
      <div className="m-0 px-2 bg-transparent rounded-none cursor-pointer z-10 transform " style={{
        translate: '0 -15px'
      }}>
          <div className="inset-x-0 h-20 mt-auto bg-transparent dark:bg-white transition duration-300 ease-in-out  -translate-y-2 z-10">
            {
            collection.once ? <div className="absolute block whitespace-nowrap top-0 text-primary translate-y-4 left-1/2 -translate-x-1/2 font-bold rounded-md border border-primary px-2">
            {collection.description}
            </div> :
            <div className="text-center">
              <div className="relative inline-block h-5">
                <svg className="block h-5 top-0" viewBox="0 0 450 100" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="50,0 400,0 450,50 400,100 50,100 0,50" style={{ fill: 'white', stroke: '#999', strokeWidth: 3 }} />
                </svg>
                <div className="absolute w-full top-0 text-xs flex flex-nowrap px-2 items-center">
                  <CircleStackIcon className="w-4 h-4 text-yellow-700" />
                  <span className="mx-auto text-gray-700 font-semibold text-[14px] leading-5">{collection.gacha1Points}</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold text-white">
                <LinearProgress 
                variant="determinate" value={collectionProgress?.progress * 100 || 0} 
                sx={{
                  height: '10px'
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
  </Card>
}