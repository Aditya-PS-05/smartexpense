/**
 * Create New Item Page
 * 
 * Form for listing a new item
 */

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useItems } from '@/hooks/useItems';
import { ItemForm } from '@/components/ItemForm';
import { Loading } from '@/components/Loading';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreateItemPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { createItem } = useItems();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (authLoading) return <Loading />;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
        <p className="text-gray-600 mb-6">Please sign in to list a new item</p>
        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
          Go to Sign In
        </Link>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await createItem(data);
      router.push('/my-items');
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
          href="/items"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">List a New Item</h1>
          <p className="text-gray-600 mt-1">Share something from your community</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ItemForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  );
}
