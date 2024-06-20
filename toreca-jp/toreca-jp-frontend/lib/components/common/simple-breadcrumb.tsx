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
      <a href={locations[0].link || '#'} className="text-gray-600 dark:text-gray-200">
        <IconHome />
      </a>

    {
    locations.slice(1).map((location, index) => <div key={index}><span className="mx-5 text-gray-500 dark:text-gray-300">/</span>

<a href={location.link} className="text-gray-600 dark:text-gray-200 hover:underline">
{location.label}
</a></div>)
}
    </div>
  );
}
