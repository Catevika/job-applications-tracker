import Link from 'next/link';
import type { JSX } from 'react';

interface ButtonLinkProps {
  href: string;
  linkClassName?: string;
  pClassName?: string;
  spanClassName?: string;
  text: string;
  icon?: JSX.Element;
}

const ButtonLink = ({
  href,
  linkClassName,
  pClassName,
  spanClassName,
  text,
  icon,
}: ButtonLinkProps) => {
  return (
    <Link href={href} className={linkClassName}>
      <p className={pClassName}>
        <span className={spanClassName}>{text}</span>
        {icon ?? null}
      </p>
    </Link>
  );
};

export default ButtonLink;