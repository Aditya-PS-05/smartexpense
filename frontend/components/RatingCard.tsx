/**
 * RatingCard Component
 * 
 * Displays individual user rating/review with:
 * - Reviewer info
 * - Star rating
 * - Review text
 * - Item reference
 * - Review date
 */

import Image from 'next/image';
import Link from 'next/link';
import { Star, Calendar } from 'lucide-react';
import type { Rating } from '@/types';

interface RatingCardProps {
  rating: Rating;
}

export function RatingCard({ rating }: RatingCardProps) {
  const reviewDate = new Date(rating.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Reviewer info */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {rating.giver?.profileImage ? (
            <Image
              src={rating.giver.profileImage}
              alt={rating.giver.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600">
                {rating.giver?.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{rating.giver?.name}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar size={12} />
              <span>{reviewDate}</span>
            </div>
          </div>
        </div>

        {/* Star rating */}
        <div>{renderStars(rating.rating)}</div>
      </div>

      {/* Review text */}
      {rating.review && (
        <p className="text-gray-700 text-sm mb-3 leading-relaxed">{rating.review}</p>
      )}

      {/* Item reference */}
      {rating.item && (
        <Link
          href={`/items/${rating.item._id}`}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
        >
          → Regarding: {rating.item.title}
        </Link>
      )}
    </div>
  );
}
