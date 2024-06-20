import { IconPlus } from "../icons/plus";

interface NewButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode
}
export function NewButton({ icon, label, onClick }: NewButtonProps) {
  return <button 
  className="flex items-center bg-green-500 p-2 text-white rounded text-sm hover:bg-green-600"
  onClick={onClick}>
    {icon || <IconPlus />}
    {label}
  </button>
}