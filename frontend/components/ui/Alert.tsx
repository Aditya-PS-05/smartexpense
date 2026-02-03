import React from 'react';
import { cn } from '@/lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'error' | 'warning';
  children: React.ReactNode;
}

export function Alert({ className, variant = 'default', children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4',
        {
          'bg-gray-50 border-gray-200 text-gray-800': variant === 'default',
          'bg-green-50 border-green-200 text-green-800': variant === 'success',
          'bg-red-50 border-red-200 text-red-800': variant === 'error',
          'bg-yellow-50 border-yellow-200 text-yellow-800': variant === 'warning',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props}>
      {children}
    </h5>
  );
}

export function AlertDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm', className)} {...props}>
      {children}
    </p>
  );
}
