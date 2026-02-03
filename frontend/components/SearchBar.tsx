'use client';

import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * SearchBar Component
 * - Real-time search input with debounce
 * - Search icon and clear button
 * - Responsive design for mobile/desktop
 */
export function SearchBar({
  onSearch,
  placeholder = 'Search items...',
  className = '',
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for debounced search
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchQuery, onSearch]);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
