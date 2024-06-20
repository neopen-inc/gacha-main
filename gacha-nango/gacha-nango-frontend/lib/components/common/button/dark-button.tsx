
interface DarkButtonProps {
  label: string;
  onClick?: () => void;
}

export function DarkButton({ label, onClick }: DarkButtonProps) {
  return <button className="rounded-3xl text-white text-lg py-2 font-bold px-10 bg-sitedark" onClick={onClick}>
    {label}
  </button>
}