
interface SkipButtonProps {
  onClick?: () => void;
}

export function SkipButton({ onClick }: SkipButtonProps) {
  return <button className="rounded-3xl text-black text-sm px-2 bg-white" onClick={onClick}>
    演出スキップ
  </button>
}