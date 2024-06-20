import { numberUtils } from "@common-utils";
import { GachaButton } from '../button/gacha-button';
import { Collection } from '@toreca-jp-app/domain/oripa/types/collection';
import { CollectionProgress } from "@toreca-jp-app/domain/oripa/types/collection-progress";

interface DisplayOripaProps {
  onClick?: () => void;
  oripa: Collection;
  collectionProgress?: CollectionProgress;
}
export function DisplayOripa({ oripa , onClick, collectionProgress}: DisplayOripaProps ) {
  return <div className="w-64 h-48 mb-24 text-center cursor-pointer" onClick={() => {
    if (Number(collectionProgress?.inventory || 0) > 0) {
      onClick && onClick();
    }
  }}>
    <div className="rounded-xl relative bg-oripaOrange" style={{
    }}>
      {Number(collectionProgress?.inventory || 0) <= 0 ? <div className="absolute m-auto top-1/2 left-1/2 z-40 text-red-700 border-red-700 border-4 text-5xl p-2 md:p-5 -translate-x-1/2 -translate-y-1/2 transform -rotate-12">完売</div> : <></>}
      <div className="text-white flex justify-between text-xs py-1 px-2">
        <span>必要コイン（１回）</span>
        <span>{numberUtils.formatNumberToLocaleString(oripa.gacha1Points)}コイン</span>
      </div>
      <img src={oripa.thumbnail} className={`rounded-b-lg ${Number(collectionProgress?.inventory || 0) <= 0 ? 'grayscale': ''}`} />
    </div>
    <div className="-translate-y-5 text-center mx-auto inline-block"
    style={{
      transform: "translateY(-50%)"
    }}
    >
      <div className="basis-full flex justify-center">
          <div className={`rounded-full bg-white px-3 text-[9px] font-semibold transform translate-y-[20%] z-10` }
            style={{
              transform: "translateY(30%)"
            }}
            >
            ガチャ枚数：{numberUtils.formatNumberToLocaleString(collectionProgress?.initialInventory)}枚<span className="text-red-700">（残り{numberUtils.formatNumberToLocaleString(collectionProgress?.inventory)}枚）</span>
          </div>
        </div>
      <GachaButton type="one" onClick={() => {
        if (Number(collectionProgress?.inventory || 0) > 0) {
          onClick && onClick();
        }
      }} />
    </div>
    
    </div>
}


//#459BA0