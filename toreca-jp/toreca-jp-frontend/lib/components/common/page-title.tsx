
interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  return <div className="text-2xl font-bold text-">{title}</div>
}