import './ribon.css';

export function Ribon2() {
  return <div className="relative text-white font-bold w-[80%] pb-[20%] translate-x-[10%] -translate-y-1/3">
    <img src="/ribon.png" className="absolute top-0 left-0 -translate-y-[40%] rotate-12" />
    <div className="font-bold text-yellow absolute -rotate-[8deg] sm:text-xl whitespace-nowrap md:text-xl top-[50%] left-[50%] -translate-x-1/2 -translate-y-2/3">
      ログインボーナス
    </div>
  </div>
}