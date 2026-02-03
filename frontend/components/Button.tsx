import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export function Button({
  className,
  variant = 'default',
  size = 'md',
  asChild = false,
  children,
  ...props
}: ButtonProps & { asChild?: boolean; children?: React.ReactNode }) {
  const buttonClass = cn(
    'font-medium rounded transition-colors inline-flex items-center justify-center',
    {
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
    },
    {
      'bg-blue-600 text-white hover:bg-blue-700': variant === 'default',
      'border border-gray-300 hover:bg-gray-50': variant === 'outline',
      'hover:bg-gray-100': variant === 'ghost',
    },
    className
  );

  // If asChild, apply classes to child instead of button
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: cn((children as React.ReactElement<any>).props.className, buttonClass),
    });
  }

  return (
    <button className={buttonClass} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

