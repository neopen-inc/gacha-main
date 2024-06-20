
interface SectionTitleProps {
  title: string;
  subtitle: string;
}

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return <div className="flex flex-col justify-center items-center">
    <div className="font-['Sans Serif'] p-5 text-2xl color-[#404247] font-semibold">
      {title}
    </div>
    <div className="text-center font-semibold ">
      <div className="px-8 py-1">{subtitle}</div>
      <div className="h-5 w-full relative">
          <div className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1 bg-[#93aa9e]"></div>
      </div>
    </div>
  </div>
}