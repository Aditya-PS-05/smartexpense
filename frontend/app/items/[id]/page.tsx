/**
 * Item Detail Page
 * 
 * Displays individual item with:
 * - Image carousel
 * - Item details
 * - Owner information
 * - Borrow request button
 */

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { itemsAPI } from '@/services/items';
import { ImageCarousel } from '@/components/ImageCarousel';
import { Button } from '@/components/Button';
import { Loading } from '@/components/Loading';
import { Error as ErrorComponent } from '@/components/Error';
import { ProfileCard } from '@/components/ProfileCard';
import Link from 'next/link';
import { MapPin, Zap, Calendar } from 'lucide-react';
import type { Item } from '@/types';

interface PageProps {
  params: { id: string };
}

export default function ItemDetailPage({ params }: PageProps) {
  const { id } = params;
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <Loading />;

  if (error || !item) {
    return <ErrorComponent title="Item Not Found" message={error || 'This item does not exist'} />;
  }

  const isOwner = user?._id === (typeof item.owner === 'object' ? item.owner._id : item.owner);

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'Available':
        return 'Available to borrow';
      case 'Borrowed':
        return 'Currently borrowed';
      default:
        return 'Not available';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images */}
        <div className="lg:col-span-2">
          <ImageCarousel images={item.images} title={item.title} />
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          {/* Title & Status */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
            </div>

            {/* Availability */}
            <div
              className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                item.availability === 'Available'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-50 text-gray-700'
              }`}
            >
              {getAvailabilityText(item.availability)}
            </div>
          </div>

          {/* Category & Condition */}
          <div className="space-y-3 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-semibold text-gray-900">{item.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Condition</p>
              <p className="font-semibold text-gray-900">{item.condition}</p>
            </div>
          </div>

          {/* Description */}
          <div className="pb-6 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">{item.description}</p>
          </div>

          {/* Location & Distance */}
          {item.location && (
            <div className="flex items-start gap-3 pb-6 border-b border-gray-200">
              <MapPin className="text-gray-400 mt-1" size={20} />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-900">{item.location.address}</p>
                {item.distance && (
                  <p className="text-sm text-gray-600 mt-1">~{item.distance.toFixed(1)} km away</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {isOwner ? (
              <>
                <Button asChild className="w-full">
                  <Link href={`/items/${item._id}/edit`}>Edit Item</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Delete Item
                </Button>
              </>
            ) : (
              <>
                <Button disabled={item.availability !== 'Available'} className="w-full">
                  <Zap size={16} className="mr-2" />
                  Request to Borrow
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/users/${typeof item.owner === 'object' ? item.owner._id : item.owner}`}>
                    View Owner Profile
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Owner Info */}
      {typeof item.owner === 'object' && (
        <div className="mt-12 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Owner</h2>
          <div className="max-w-md">
            <ProfileCard user={item.owner} />
          </div>
        </div>
      )}
    </div>
  );
}
