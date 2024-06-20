
interface BaseDialogProps {
  icon?: React.ReactNode,
  isOpen: boolean;
  confirmLabel: string;
  days: number;
  checkinConfigs?: { days: number, points: number }[];
  onConfirm: () => void;
}

export function StampCard({ isOpen, days, onConfirm, confirmLabel, checkinConfigs }: BaseDialogProps) {
  const maxDays = () => checkinConfigs?.reduce((max, config) => Math.max(max, config.days), 0) || 0;
  const matchConfig = (i: number) => checkinConfigs?.find((config) => config.days === i);
  return (
    <div className={`${isOpen ? '' : 'hidden'} relative z-50 bg-light`} aria-labelledby="modal-title" role="dialog" aria-modal="true">

      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform bg-white rounded-lg bg-secondary text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div className="bg-light px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full ">
                  <h3>ログインボーナス</h3>
                  <div className="mt-2 flex justify-around">
                    {Array.from(Array(days).keys()).map((i) =>
                      <div key={i} className="border rounded-full border-primary  align-middle text-center flex justify-center">
                        <div className={`rounded-full text-red-900 text-center h-8
                        ${checkinConfigs?.find((config) => config.days === i + 1) ? 'bg-red-700 text-white' : ''}
                      ${i === days - 1 ? '' : ''}
                      `}>
                          <div className="text-xs align-middle leading-8">{
                            checkinConfigs && checkinConfigs.find((config) => config.days === i + 1) ? `${checkinConfigs.find((config) => config.days === i + 1)?.points}p` : `${i + 1}日目`
                          }</div>
                      </div>
                      </div>
                    )}
                    {Array.from(Array(maxDays() - days).keys()).map((i) =>
                      <div key={i + days} className="border rounded-full border-gray align-middle text-center flex justify-center">
                        <div className={`rounded-full text-gray-400 ${checkinConfigs?.find((config) => config.days === i + days + 1) ? 'bg-gray-400 text-white' : ''} leading-6 text-center w-8 h-8`}>
                          <div className="text-xs align-middle leading-8">{
                            checkinConfigs && checkinConfigs.find((config) => config.days === i + days + 1) ? `${checkinConfigs.find((config) => config.days === i + days + 1)?.points}p` : `${i + days + 1}日目`
                          }</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
            <div className="  px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button onClick={onConfirm} type="button" className={`grow-0 inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}>確認</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}