/**
 * Type declarations for Next.js modules
 */

declare module 'next/link' {
  import { ComponentType, ReactNode } from 'react';

  interface LinkProps {
    href: string | { pathname?: string; query?: Record<string, any> };
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean | null;
    locale?: string | false;
    className?: string;
    children?: ReactNode;
    [key: string]: any;
  }

  const Link: ComponentType<LinkProps>;
  export default Link;
}
