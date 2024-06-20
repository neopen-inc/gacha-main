import './stamp-card.css'
import { Ribon2 } from './ribon2';

interface BaseDialogProps {
  icon?: React.ReactNode,
  isOpen: boolean;
  confirmLabel: string;
  days: number;
  checkinConfigs?: { days: number, points: number }[];
  onConfirm: () => void;
}

export function StampCard({ isOpen, days, checkinConfigs, onConfirm, confirmLabel }: BaseDialogProps) {
  const maxDays = checkinConfigs?.reduce((max, config) => Math.max(max, config.days), 0) || 0;
  const maxDayPoints = checkinConfigs?.find(config => config.days === maxDays)?.points || 0;

  
  //console.log(maxDays)
  //console.log(days)
  return days ? (
    <div className={`${isOpen ? '' : 'hidden'} relative z-50 bg-light`} aria-labelledby="modal-title" role="dialog" aria-modal="true">

      <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0  overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform  rounded-lg bg-red-300 bg-center text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            style={{}}
          >
            <Ribon2 />

            <div className="bg-light mx-8 p-4 sm:pb-4 bg-white/80 rounded-lg border-gray-500 border-4 border-double">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full ">
                  {days === 7 &&
                    <div>100ポイント獲得しました。</div>
                  }
                  <div className="mt-2 grid-cols-3 grid md:grid-cols-5 place-items-center place-content-center ">
                    {Array.from(Array(days).keys()).map((i) =>
                      <div key={i} className="place-items-center place-self-center border  mb-2 w-16 h-16 p-1 relative inline-block rounded border-gradient align-middle text-center justify-center bg-[rgba(0,0,0,0.2)]">
                        <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.2)] rounded">
                        </div>

                        <div className={`rounded-full border-red-900 text-red-900 border leading-6 text-center stampball absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      `}></div>
                      </div>
                    )}
                    {Array.from(Array(maxDays - days).keys()).map((i) =>
                      <div key={i} className={`p-1 mb-2 place-self-center align-middle text-center border w-16 h-16 rounded border-gradient inline-block justify-center relative bg-[rgba(0,0,0,0.2)]`}>

                        {checkinConfigs && checkinConfigs.find((config) => config.days === i + days + 1) ? <div className=" top-0 w-full h-full rounded text-xs flex flex-wrap justify-center">
                          <div className="items-stretch items-middle leading-[50px] font-bold text-lg text-white grow relative align-middle text-center " style={{
                            //background: "repeating-linear-gradient(135deg, #F5B1F6AA, #F5B1F6AA 10px, #FFFFFFAA 10px, #FFFFFFAA 20px)"
                          }}>
                            <img src="/coins.png" className="w-7 h-7 mx-auto" />
                            <div className="text-text-red font-bold text-sm absolute bottom-0 w-full">x{checkinConfigs.find((config) => config.days === i + days + 1)?.points}</div>
                          </div>
                        </div> : <div className=" w-full h-full rounded text-xs flex flex-wrap justify-center align-middle items-center text-center ">
                          <div className="font-bold text-white ">
                            {i + days + 1}日目
                          </div>
                        </div>}
                      </div>
                    )}
                  </div>
                  {days !== maxDays &&
                    <div className="mt-2 p-2 bg-red-700 rounded-lg border-[10px] border-double border-yellow-500">
                      <p className="text-lg  text-white text-center">{maxDayPoints}ポイント報酬まで</p>
                      <p className="text-lg  text-yellow-500 text-center">あと{maxDays - days}日</p>
                    </div>
                  }
                  {days === maxDays &&
                    <div className="mt-2 p-2 bg-red-700 rounded-lg border-[10px] border-double border-yellow-500">
                      <p className="text-lg  text-white text-center">{maxDayPoints}pt獲得しました！</p>
                    </div>
                  }

                </div>

              </div>
            </div>
            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button onClick={onConfirm} type="button" className={`grow-0 inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}>確認</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  ) : <></>
}