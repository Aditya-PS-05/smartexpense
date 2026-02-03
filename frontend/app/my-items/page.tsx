/**
 * My Items Page
 * 
 * User's listed items with:
 * - All user's items
 * - Edit/Delete actions
 * - Item status
 */

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { itemsAPI } from '@/services/items';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { EmptyState } from '@/components/EmptyState';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import type { Item } from '@/types';

export default function MyItemsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await itemsAPI.getUserItems(user!._id);
        setItems(response.data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchItems();
  }, [user, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await itemsAPI.delete(id);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  if (authLoading || loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Items</h1>
          <p className="text-gray-600 mt-1">Manage your listed items</p>
        </div>
        <Button asChild size="sm">
          <Link href="/items/new">
            <Plus size={16} className="mr-2" />
            List New Item
          </Link>
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      {/* Items Grid */}
      {items.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No Items Yet"
          description="You haven't listed any items yet. Start sharing!"
          action={{
            label: 'List Your First Item',
            href: '/items/new',
          }}
        />
      ) : (
        <>
          {/* Stats */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 font-semibold">
              You have {items.length} item{items.length !== 1 ? 's' : ''} listed
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onDelete={handleDelete}
                showActions={true}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
