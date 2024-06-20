import { PlayCircleIcon } from "@heroicons/react/24/solid";


interface GachaButtonProps {
  type: string;
  onClick?: () => void;
}

export function Gacha2Button({ type, onClick }: GachaButtonProps) {
  return <button className={`rounded-full text-center justify-center text-white text-sm whitespace-nowrap lg:text-lg font-bold py-3 px-10 ${type === 'one' ? 'bg-gachaorange' : 'bg-gachared'} flex flex-nowrap grow-0 items-center drop-shadow`}
    style={{
      textShadow: '0px 2px 2px #000000',
      boxShadow: '0px 2px 0px #ce9533'
    }}
    onClick={onClick}>
      <span>{type === 'one' ? '1回引く！' : '10回引く！'}</span>
    
      <span><PlayCircleIcon className="w-5 text-white" /></span>
  </button>
}
