'use client';

import { useState, useCallback } from 'react';
import { SortOption } from '@/components/SortDropdown';

export interface FilterState {
  searchQuery: string;
  category: string;
  availability: string;
  radius: number;
  sort: SortOption;
}

export const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: '',
  availability: '',
  radius: 10,
  sort: 'distance',
};

/**
 * useFilters Hook
 * - Manages search and filter state
 * - Handles filter updates and resets
 */
export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const updateSearch = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const updateCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const updateAvailability = useCallback((availability: string) => {
    setFilters((prev) => ({ ...prev, availability }));
  }, []);

  const updateRadius = useCallback((radius: number) => {
    setFilters((prev) => ({ ...prev, radius }));
  }, []);

  const updateSort = useCallback((sort: SortOption) => {
    setFilters((prev) => ({ ...prev, sort }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    filters,
    updateSearch,
    updateCategory,
    updateAvailability,
    updateRadius,
    updateSort,
    resetFilters,
  };
}
