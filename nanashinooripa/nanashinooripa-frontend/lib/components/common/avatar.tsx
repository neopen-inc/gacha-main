import Link from "next/link";

interface AvatarProps{
  src: string;
  alt?: string;
  href?: string;
  onClick?: () => void;
}
export function Avatar( { src, alt, href, onClick }: AvatarProps) {
  const wrapped = (node: React.ReactNode, { href, onClick }: {href?: string; onClick?: () => void}): React.ReactNode => {
    return href ? <Link href={href}>{node}</Link> : <a onClick={onClick}>{node}</a>
  }
  return href || onClick ? wrapped(<img className="rounded-full w-16 h-16" src={src} alt={alt} />, { href , onClick}) : <img className="rounded-full w-16 h-16" src={src} alt={alt} />
}