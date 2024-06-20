
export interface VerticalIconButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}
export function VerticalIconButton({ icon, label, onClick }: VerticalIconButtonProps) {
  return <button type="button" 
  className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
  onClick={onClick}
  >
  {icon}
  <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">{label}</span>
</button>
}