import Link from "next/link";

interface OutlinedButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}
export function OutlinedButton({label, href, size = "sm", onClick}: OutlinedButtonProps) {
  const sizeClasses =  size === 'sm' ? 'text-xs px-4 py-2' : 
  size === 'md' ? 'text-sm px-6 py-3' :  "font-bold uppercase px-8 py-3 "
  return href ? <Link href={href} className={`${sizeClasses} text-primary border border-primary hover:bg-primary hover:text-white active:bg-primary font-bold uppercase rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`} 
  >
    {label}
</Link>: <button onClick={onClick} className={`${sizeClasses} text-primary border border-primary hover:bg-primary hover:text-white active:bg-primary font-bold uppercase rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150`}
  >{label}</button>  

}