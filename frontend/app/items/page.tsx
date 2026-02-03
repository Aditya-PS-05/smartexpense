/**
 * Browse Items Page
 * 
 * Displays all items with:
 * - Grid layout (responsive)
 * - Pagination
 * - Search functionality
 * - Category filter
 */

'use client';

import { useState } from 'react';
import { useItems } from '@/hooks/useItems';
import { ItemCard } from '@/components/ItemCard';
import { Pagination } from '@/components/Pagination';
import { Loading } from '@/components/Loading';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { Search, Plus } from 'lucide-react';
import { CATEGORIES } from '@/constants';

export default function ItemsPage() {
  const { items, loading, error, page, totalPages, setPage } = useItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter items based on search and category
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
          <p className="text-gray-600 mt-1">Find items to borrow in your community</p>
        </div>
        <Button asChild size="sm">
          <Link href="/items/new">
            <Plus size={16} className="mr-2" />
            List New Item
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search items by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-3">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No Items Found"
          description={
            searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search or filters'
              : 'No items are currently available. Be the first to list an item!'
          }
          action={
            (searchTerm || selectedCategory !== 'All') ? undefined : {
              label: 'List Your First Item',
              href: '/items/new',
            }
          }
        />
      ) : (
        <>
          {/* Results count */}
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredItems.length} of {items.length} items
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
