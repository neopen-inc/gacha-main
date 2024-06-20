
interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  return <div className="text-2xl lg:text-4xl font-bold">{title}</div>
}