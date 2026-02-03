'use client';

import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './Button';

export const CATEGORIES = [
  'Electronics',
  'Tools',
  'Books',
  'Furniture',
  'Sports',
  'Kitchen',
  'Clothing',
  'Toys',
  'Garden',
  'Other',
];

export const AVAILABILITY_OPTIONS = [
  { value: 'Available', label: 'Available Now' },
  { value: 'Scheduled', label: 'Scheduled' },
];

interface FilterSheetProps {
  selectedCategory: string;
  selectedAvailability: string;
  selectedRadius: number;
  onCategoryChange: (category: string) => void;
  onAvailabilityChange: (availability: string) => void;
  onRadiusChange: (radius: number) => void;
  onClose: () => void;
  isOpen: boolean;
}

/**
 * FilterSheet Component
 * - Mobile-friendly filter panel
 * - Category, location radius, and availability filters
 * - Slide-in panel with overlay
 */
export function FilterSheet({
  selectedCategory,
  selectedAvailability,
  selectedRadius,
  onCategoryChange,
  onAvailabilityChange,
  onRadiusChange,
  onClose,
  isOpen,
}: FilterSheetProps) {
  const [tempCategory, setTempCategory] = useState(selectedCategory);
  const [tempAvailability, setTempAvailability] = useState(selectedAvailability);
  const [tempRadius, setTempRadius] = useState(selectedRadius);

  const handleApply = () => {
    onCategoryChange(tempCategory);
    onAvailabilityChange(tempAvailability);
    onRadiusChange(tempRadius);
    onClose();
  };

  const handleReset = () => {
    setTempCategory('');
    setTempAvailability('');
    setTempRadius(10);
    onCategoryChange('');
    onAvailabilityChange('');
    onRadiusChange(10);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Filter Sheet */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto md:static md:transform-none md:shadow-none md:w-auto md:bg-transparent md:z-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 md:border-0 md:p-0 md:mb-6">
          <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2 md:text-base">
            <Filter size={20} />
            Filters
          </h3>
          <button
            onClick={onClose}
            className="md:hidden text-gray-600 hover:text-gray-900"
            aria-label="Close filters"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 md:p-0 space-y-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Category
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <button
                onClick={() => setTempCategory('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  tempCategory === ''
                    ? 'bg-blue-100 text-blue-900 font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTempCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    tempCategory === cat
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Availability
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setTempAvailability('')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  tempAvailability === ''
                    ? 'bg-blue-100 text-blue-900 font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                All Status
              </button>
              {AVAILABILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTempAvailability(opt.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    tempAvailability === opt.value
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Radius Filter */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-900">
                Location Radius
              </label>
              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                {tempRadius} km
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={tempRadius}
              onChange={(e) => setTempRadius(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              aria-label="Location radius in kilometers"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-3 md:border-0 md:p-0 md:mt-6 md:space-y-2 md:flex md:gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full md:flex-1 text-sm"
          >
            Reset
          </Button>
          <Button
            onClick={handleApply}
            className="w-full md:flex-1 text-sm md:hidden"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
}
