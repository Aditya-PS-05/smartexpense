/**
 * Browse Items Page
 *
 * Features:
 * - Real-time search with debounce
 * - Advanced filtering (category, availability, radius)
 * - Sort options (distance, newest, rating)
 * - Responsive grid layout with pagination
 */

'use client';

import { useState, useMemo } from 'react';
import { useItems } from '@/hooks/useItems';
import { useFilters } from '@/hooks/useFilters';
import { ItemCard } from '@/components/ItemCard';
import { Pagination } from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import { FilterSheet } from '@/components/FilterSheet';
import { SortDropdown, type SortOption } from '@/components/SortDropdown';
import { Loading } from '@/components/Loading';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { Filter, Plus } from 'lucide-react';

export default function ItemsPage() {
  const { items, loading, error, page, totalPages, setPage } = useItems();
  const {
    filters,
    updateSearch,
    updateCategory,
    updateAvailability,
    updateRadius,
    updateSort,
  } = useFilters();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter and sort items
  const processedItems = useMemo(() => {
    let result = items;

    // Apply search filter
    if (filters.searchQuery) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter((item) => item.category === filters.category);
    }

    // Apply availability filter
    if (filters.availability) {
      result = result.filter((item) => item.availability === filters.availability);
    }

    // Apply sorting
    switch (filters.sort) {
      case 'newest':
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'distance':
      case 'rating':
      default:
        // TODO: Implement when location/rating data available
        break;
    }

    return result;
  }, [items, filters]);

  const handleDeleteItem = async (itemId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete item:', itemId);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Items</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
            <p className="text-gray-600 mt-1">Find items to borrow in your community</p>
          </div>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/items/new" className="flex items-center gap-2">
              <Plus size={16} />
              List Item
            </Link>
          </Button>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8 space-y-4">
          {/* Search Bar */}
          <SearchBar
            onSearch={updateSearch}
            placeholder="Search items by title or description..."
          />

          {/* Filter & Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <Filter size={18} />
              Filters
            </button>

            <SortDropdown
              selectedSort={filters.sort as SortOption}
              onSortChange={updateSort}
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                updateSearch('');
                updateCategory('');
                updateAvailability('');
                updateRadius(10);
                updateSort('distance');
              }}
              className="text-xs sm:text-sm"
            >
              Clear All
            </Button>
          </div>

          {/* Active Filters Display (Mobile) */}
          {(filters.searchQuery ||
            filters.category ||
            filters.availability ||
            filters.radius !== 10) && (
            <div className="flex flex-wrap gap-2 sm:hidden">
              {filters.searchQuery && (
                <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  Search: {filters.searchQuery}
                </div>
              )}
              {filters.category && (
                <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  {filters.category}
                </div>
              )}
              {filters.availability && (
                <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  {filters.availability}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter Sheet (Mobile) */}
        <FilterSheet
          isOpen={isFilterOpen}
          selectedCategory={filters.category}
          selectedAvailability={filters.availability}
          selectedRadius={filters.radius}
          onCategoryChange={updateCategory}
          onAvailabilityChange={updateAvailability}
          onRadiusChange={updateRadius}
          onClose={() => setIsFilterOpen(false)}
        />

        {/* Desktop Sidebar + Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSheet
              isOpen={true}
              selectedCategory={filters.category}
              selectedAvailability={filters.availability}
              selectedRadius={filters.radius}
              onCategoryChange={updateCategory}
              onAvailabilityChange={updateAvailability}
              onRadiusChange={updateRadius}
              onClose={() => {}}
            />
          </div>

          {/* Items Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <Loading />
            ) : processedItems.length === 0 ? (
              <EmptyState
                title="No items found"
                description={
                  filters.searchQuery || filters.category || filters.availability
                    ? 'Try adjusting your filters or search query'
                    : 'Start by listing an item or browse other communities'
                }
              />
            ) : (
              <div className="space-y-6">
                {/* Results Info */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{processedItems.length}</span>{' '}
                    {processedItems.length === 1 ? 'item' : 'items'}
                  </p>
                  <Button asChild size="sm" className="sm:hidden">
                    <Link href="/items/new">List Item</Link>
                  </Button>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {processedItems.map((item) => (
                    <ItemCard
                      key={item._id}
                      item={item}
                      onDelete={handleDeleteItem}
                      showActions={false}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
