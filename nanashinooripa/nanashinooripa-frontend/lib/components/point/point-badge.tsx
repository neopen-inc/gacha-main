

export interface PointBadgeProps {
  point: string;
}
export function PointBadge({ point }: PointBadgeProps) {
  return <span className="relative inline-flex bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-10 py-5 rounded-full dark:bg-blue-900 dark:text-blue-300">
    <svg width="110" height="110" xmlns="http://www.w3.org/2000/svg">
      <circle cx="55" cy="55" r="50" fill="gold">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 55 55"
          to="360 55 55"
          dur="1s"
          repeatCount="indefinite" />
      </circle>
      <text x="35" y="65" fill="black" fontFamily="Verdana" fontSize="20">
        $
      </text>
    </svg>
    {point}
    <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">+</div>
  </span>



}