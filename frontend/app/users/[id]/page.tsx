/**
 * Public User Profile Page
 * 
 * Displays any user's public profile with:
 * - Profile card (without edit option)
 * - User's ratings and reviews
 * - Message button to contact user
 * - Listed items
 */

'use client';

import { useEffect, useState } from 'react';
import { userAPI } from '@/services/user';
import { ProfileCard } from '@/components/ProfileCard';
import { RatingCard } from '@/components/RatingCard';
import { Loading } from '@/components/Loading';
import { Error as ErrorComponent } from '@/components/Error';
import { EmptyState } from '@/components/EmptyState';
import { useRouter } from 'next/navigation';
import type { User, Rating } from '@/types';

interface PageProps {
  params: { id: string };
}

export default function PublicProfilePage({ params }: PageProps) {
  const router = useRouter();
  const { id } = params;
  const [user, setUser] = useState<User | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile
        const userRes = await userAPI.getUserProfile(id);
        setUser(userRes.user);

        // Fetch user ratings
        const ratingsRes = await userAPI.getUserRatings(id);
        setRatings(ratingsRes.ratings || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleMessage = () => {
    // TODO: Implement messaging flow
    console.log('Message user:', id);
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !user) {
    return (
      <ErrorComponent
        title="Profile Not Found"
        message={error || 'This user profile does not exist'}
        onRetry={() => router.push('/items')}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="mb-8">
        <ProfileCard user={user} isOwnProfile={false} onMessage={handleMessage} />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Ratings */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
            <p className="text-gray-600 text-sm mt-1">
              {ratings.length === 0
                ? 'No reviews yet'
                : `${ratings.length} review${ratings.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {ratings.length === 0 ? (
            <EmptyState
              icon="⭐"
              title="No Reviews Yet"
              description="This user hasn't received any reviews from borrowers."
            />
          ) : (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <RatingCard key={rating._id} rating={rating} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Stats */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">Trust Score</h3>

            {/* Rating */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Overall Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-blue-600">
                  {user.averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">/ 5.0</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Based on {user.totalRatings} reviews</p>
            </div>

            <hr className="my-4" />

            {/* Member info */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Member Since</p>
              <p className="font-semibold text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>

            <hr className="my-4" />

            {/* Verification */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Verification</p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    user.isVerified ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
                <span className="font-semibold text-gray-900">
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {user.isVerified ? 'Email confirmed' : 'Email not confirmed'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
