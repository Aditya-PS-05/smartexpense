/**
 * ProfileCard Component
 * 
 * Displays user profile information with:
 * - Profile image and basic info
 * - Address and location
 * - Trust metrics (ratings, reviews)
 * - Member since date
 * - Edit/Message buttons
 */

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, MessageCircle, Star, Calendar } from 'lucide-react';
import { Button } from './Button';
import type { User } from '@/types';

interface ProfileCardProps {
  user: User;
  isOwnProfile?: boolean;
  onMessage?: () => void;
}

export function ProfileCard({ user, isOwnProfile = false, onMessage }: ProfileCardProps) {
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {/* Header background */}
      <div className="h-24 bg-gradient-to-r from-blue-600 to-blue-400" />

      <div className="px-6 pb-6 -mt-12 relative">
        {/* Profile image */}
        <div className="flex justify-between items-start">
          <div className="relative">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name}
                width={100}
                height={100}
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-300 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-600">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {user.isVerified && (
              <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1">
                <span className="text-xs">✓</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {isOwnProfile ? (
              <Button asChild size="sm">
                <Link href="/profile/edit">Edit Profile</Link>
              </Button>
            ) : (
              <Button size="sm" onClick={onMessage}>
                <MessageCircle size={16} className="mr-2" />
                Message
              </Button>
            )}
          </div>
        </div>

        {/* User info */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-600 text-sm mt-1">{user.email}</p>

          {/* Location */}
          {user.address?.city && (
            <div className="flex items-center gap-1 text-gray-600 text-sm mt-2">
              <MapPin size={16} />
              <span>
                {user.address.city}
                {user.address.state && `, ${user.address.state}`}
              </span>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
          {/* Rating */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-gray-900">{user.averageRating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-gray-500">{user.totalRatings} reviews</p>
          </div>

          {/* Member since */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar size={16} className="text-blue-600" />
              <span className="font-bold text-gray-900">Member</span>
            </div>
            <p className="text-xs text-gray-500">{joinDate}</p>
          </div>

          {/* Verification status */}
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900 mb-1">
              {user.isVerified ? '✓ Verified' : 'Unverified'}
            </div>
            <p className="text-xs text-gray-500">
              {user.isVerified ? 'Email confirmed' : 'Verify email'}
            </p>
          </div>
        </div>

        {/* Contact info */}
        {user.phone && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Phone:</span> {user.phone}
            </p>
            {user.address?.street && (
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">Address:</span>
                <br />
                {user.address.street}, {user.address.zipCode}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
