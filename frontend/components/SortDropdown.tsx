'use client';

import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export type SortOption = 'distance' | 'newest' | 'rating';

interface SortDropdownProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string; icon?: string }[] = [
  { value: 'distance', label: 'Nearest' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
];

/**
 * SortDropdown Component
 * - Sort items by distance, date, or rating
 * - Dropdown menu with clean design
 * - Responsive on mobile/desktop
 */
export function SortDropdown({
  selectedSort,
  onSortChange,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    SORT_OPTIONS.find((opt) => opt.value === selectedSort)?.label || 'Sort by';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleSelect = (sort: SortOption) => {
    onSortChange(sort);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base text-gray-700 font-medium"
        aria-label="Sort options"
        {...(isOpen && { 'aria-expanded': 'true' })}
        {...(!isOpen && { 'aria-expanded': 'false' })}
      >
        {selectedLabel}
        <ChevronDown
          size={18}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  selectedSort === option.value
                    ? 'bg-blue-50 text-blue-900 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
