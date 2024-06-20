
interface DarkButtonProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export function NarrowDownButton({ label, onClick, selected }: DarkButtonProps) {
  return <button className={`rounded-3xl text-sm py-1 w-32 ${selected ? 'bg-orange text-white' : 'text-orange'} border border-orange`} onClick={onClick}>
    {label}
  </button>
}