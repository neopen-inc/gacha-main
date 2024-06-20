import Link from "next/link";

interface NormalLinkProps {
  href: string;
  label: string;
}

export function NormalLink({ href, label }: NormalLinkProps) {
  return <Link className="text-sky-500 underline" href={href}>
    {label}
  </Link>
}