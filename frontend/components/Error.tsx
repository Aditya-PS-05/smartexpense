/**
 * Error Component
 * 
 * Shows error messages with retry option
 */

import { Button } from '@/components/Button';

interface ErrorProps {
  title: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function Error({
  title,
  message,
  onRetry,
  showRetry = true,
}: ErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex gap-4">
        <div className="text-red-600 text-2xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-900 mb-1">{title}</h3>
          <p className="text-red-800 text-sm mb-4">{message}</p>
          {showRetry && onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
