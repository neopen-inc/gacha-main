import { PlayCircleIcon } from "@heroicons/react/24/solid";


interface GachaButtonProps {
  type: string;
  onClick?: () => void;
}

export function Gacha2Button({ type, onClick }: GachaButtonProps) {
  return <button className={`rounded-full text-center justify-center text-white text-sm whitespace-nowrap lg:text-lg font-bold py-3 px-16 ${type === 'one' ? 'bg-gachaOne' : 'bg-primary'} flex flex-nowrap grow-0 items-center drop-shadow`}
    onClick={onClick}>
      <span>{type === 'one' ? 'ガチャる' : '10連ガチャる'}</span>
      <span><PlayCircleIcon className="w-5 text-white" /></span>
  </button>
}
