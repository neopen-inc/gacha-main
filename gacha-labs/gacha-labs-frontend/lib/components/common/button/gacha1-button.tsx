import { PlayCircleIcon } from "@heroicons/react/24/solid";


interface Gacha1ButtonProps {
  onClick?: () => void;
}

export function Gacha1Button({  onClick }: Gacha1ButtonProps) {
  return <button className={`rounded-full text-white text-3xl font-bold py-3 px-10 bg-gachaButtonOrange flex flex-nowrap items-center drop-shadow`}
    style={{
      textShadow: '0px 0px 2px #000000',
      boxShadow: "0 2px 0 #ce9533",
    }}
    onClick={onClick}>
      <span className="whitespace-nowrap">ガチャを引く！</span>
      <span><PlayCircleIcon className="w-5 text-white" /></span>
  </button>
}
