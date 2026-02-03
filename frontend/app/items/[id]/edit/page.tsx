/**
 * Edit Item Page
 * 
 * Form for editing existing item
 */

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useItems } from '@/hooks/useItems';
import { itemsAPI } from '@/services/items';
import { ItemForm } from '@/components/ItemForm';
import { Loading } from '@/components/Loading';
import { Error as ErrorComponent } from '@/components/Error';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Item } from '@/types';

interface PageProps {
  params: { id: string };
}

export default function EditItemPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;
  const { user, loading: authLoading } = useAuth();
  const { updateItem } = useItems();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await itemsAPI.get(id);
        setItem(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (authLoading || loading) return <Loading />;

  if (error) {
    return <ErrorComponent title="Error" message={error} />;
  }

  if (!item) {
    return <ErrorComponent title="Item Not Found" message="This item does not exist" />;
  }

  // Check ownership
  const isOwner = user?._id === (typeof item.owner === 'object' ? item.owner._id : item.owner);
  if (!isOwner) {
    return (
      <ErrorComponent
        title="Unauthorized"
        message="You can only edit your own items"
      />
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await updateItem(id, data);
      router.push(`/items/${id}`);
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={`/items/${id}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Item</h1>
          <p className="text-gray-600 mt-1">Update your item details</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ItemForm
          initialData={item}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
