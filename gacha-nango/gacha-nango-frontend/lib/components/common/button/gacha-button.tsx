import { PlayCircleIcon } from "@heroicons/react/24/solid";


interface GachaButtonProps {
  type: string;
  onClick?: () => void;
}

export function GachaButton({ type, onClick }: GachaButtonProps) {
  return <button className={`rounded-2xl text-white text-lg font-bold py-1 px-16 bg-gachaorange flex flex-nowrap items-center drop-shadow`}
    style={{
      textShadow: '0px 0px 2px #000000'
    }}
    onClick={onClick}>
      <span className="whitespace-nowrap">{type === 'one' ? '1回引く！' : '10回引く！'}</span>
    
      <span><PlayCircleIcon className="w-5 text-white" /></span>
  </button>
}
