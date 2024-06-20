import { PlayCircleIcon } from "@heroicons/react/24/solid";


interface GachaButtonProps {
  type: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function Gacha2Button({ type, onClick, disabled}: GachaButtonProps) {
  const language = navigator.language;
  
  const getButtonText = (type: string) => {
    if (language.includes('en')) {
      return type === 'one' ? 'Gacha' : 'Gacha 10 times';
    } else if (language.includes('zh')) {
      return type === 'one' ? '抽选' : '10连抽';
    } else {
      return type === 'one' ? 'ガチャる' : '10連ガチャる';
    }
  }
  

  return <button disabled={disabled} className={`rounded-full text-center justify-center text-white text-sm whitespace-nowrap lg:text-lg font-bold py-3 px-16 ${type === 'one' ? 'bg-gachaOne' : 'bg-primary'} flex flex-nowrap grow-0 items-center drop-shadow`}
    onClick={onClick}>
      <span>{getButtonText(type)}</span>
      <span><PlayCircleIcon className="w-5 text-white" /></span>
  </button>
}
