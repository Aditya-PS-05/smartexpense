/**
 * Type declarations for Next.js modules
 */

declare module 'next/link' {
  import { ComponentType, ReactNode } from 'react';

  interface LinkProps {
    href: string | { pathname?: string; query?: Record<string, string | number | boolean | undefined> };
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean | null;
    locale?: string | false;
    className?: string;
    children?: ReactNode;
    onClick?: () => void;
    target?: string;
    rel?: string;
  }

  const Link: ComponentType<LinkProps>;
  export default Link;
}
