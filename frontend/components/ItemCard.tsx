/**
 * ItemCard Component
 * 
 * Displays item preview with:
 * - Item image
 * - Title and description
 * - Category and condition
 * - Availability status
 * - Owner info
 * - Distance (if available)
 */

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { Item } from '@/types';

interface ItemCardProps {
  item: Item;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function ItemCard({ item, onDelete, showActions = false }: ItemCardProps) {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Borrowed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-emerald-100 text-emerald-700';
      case 'Like New':
        return 'bg-green-100 text-green-700';
      case 'Good':
        return 'bg-blue-100 text-blue-700';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-700';
      case 'Poor':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Link href={`/items/${item._id}`}>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          {item.images && item.images[0] ? (
            <Image
              src={item.images[0]}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}

          {/* Availability Badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border ${getAvailabilityColor(item.availability)}`}>
            {item.availability === 'Available' ? (
              <>
                <CheckCircle2 className="inline mr-1" size={12} />
                Available
              </>
            ) : (
              <>
                <AlertCircle className="inline mr-1" size={12} />
                {item.availability}
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category & Condition */}
          <div className="flex gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
              {item.category}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded ${getConditionColor(item.condition)}`}>
              {item.condition}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{item.title}</h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>

          {/* Owner & Distance */}
          <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
            {/* Owner */}
            <div className="flex items-center gap-2">
              {item.owner?.profileImage ? (
                <Image
                  src={item.owner.profileImage}
                  alt={item.owner.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                  {item.owner?.name.charAt(0)}
                </div>
              )}
              <span className="text-gray-700 font-medium truncate">{item.owner?.name}</span>
            </div>

            {/* Distance */}
            {item.distance && (
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin size={14} />
                <span>{item.distance.toFixed(1)} km away</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <Link
                href={`/items/${item._id}/edit`}
                className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-center"
              >
                Edit
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete?.(item._id);
                }}
                className="flex-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
