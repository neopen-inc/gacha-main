import Link from "next/link";
import { IconHome } from "../icons/home";

interface SimpleBreadcrumbProps {
  locations: {
    link: string;
    label: string;
  }[]
}
export function SimpleBreadcrumb({ locations }: SimpleBreadcrumbProps) {
  return (
    <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap">
      <Link href={locations[0].link || '#'} className="text-gray-600">
        <IconHome />
      </Link>

    {
    locations.slice(1).map((location, index) => <div key={index}><span className="mx-5 text-gray-500">/</span>

<Link href={location.link} className="text-gray-600 hover:underline">
{location.label}
</Link></div>)
}
    </div>
  );
}
