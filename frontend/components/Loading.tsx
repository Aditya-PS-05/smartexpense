/**
 * Loading Component
 * 
 * Generic loading spinner for async operations
 */

export function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative w-12 h-12">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
      </div>
      <span className="ml-4 text-gray-600">Loading...</span>
    </div>
  );
}

/**
 * Loading Overlay
 * Full screen loading indicator
 */
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
        </div>
        <p className="text-gray-600">Processing...</p>
      </div>
    </div>
  );
}
