
interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  return <div className="text-4xl font-bold text-">{title}</div>
}