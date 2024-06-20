
interface OpenCloseArrowProps {
  isOpen: boolean;
}
export function IconOpenCloseArrow({ isOpen }: OpenCloseArrowProps) {
  return <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  className={`h-5 w-5 ${isOpen ? 'transform rotate-90' : ''}`}
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
</svg>
}