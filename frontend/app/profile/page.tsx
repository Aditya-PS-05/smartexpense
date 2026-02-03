/**
 * User Profile Page
 * 
 * Displays current user's profile with:
 * - Profile information card
 * - User ratings and reviews
 * - Listed items
 * - Navigation to edit profile
 */

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { userAPI } from '@/services/user';
import { ProfileCard } from '@/components/ProfileCard';
import { RatingCard } from '@/components/RatingCard';
import { Loading } from '@/components/Loading';
import { Error as ErrorComponent } from '@/components/Error';
import { EmptyState } from '@/components/EmptyState';
import { useState, useEffect } from 'react';
import type { Rating } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, error } = useProfile();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login');
    }
  }, [authUser, authLoading, router]);

  // Fetch user ratings
  useEffect(() => {
    if (profile?._id) {
      const fetchRatings = async () => {
        try {
          setRatingsLoading(true);
          const response = await userAPI.getUserRatings(profile._id);
          setRatings(response.ratings || []);
        } catch (err) {
          console.error('Failed to fetch ratings:', err);
        } finally {
          setRatingsLoading(false);
        }
      };

      fetchRatings();
    }
  }, [profile?._id]);

  if (authLoading || profileLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorComponent title="Error" message={error} />;
  }

  if (!profile) {
    return <EmptyState icon="👤" title="No Profile" description="Unable to load profile" />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Card */}
      <div className="mb-8">
        <ProfileCard user={profile} isOwnProfile={true} />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Ratings */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
            <p className="text-gray-600 text-sm mt-1">
              {ratings.length === 0 ? 'No reviews yet' : `${ratings.length} review${ratings.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {ratingsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : ratings.length === 0 ? (
            <EmptyState
              icon="⭐"
              title="No Reviews Yet"
              description="You haven't received any reviews from borrowers."
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
            <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>

            {/* Rating */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Overall Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-blue-600">
                  {(profile.averageRating || 0).toFixed(1)}
                </span>
                <span className="text-sm text-gray-500">/ 5.0</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Based on {profile.totalRatings || 0} reviews</p>
            </div>

            <hr className="my-4" />

            {/* Member info */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Member Since</p>
              <p className="font-semibold text-gray-900">
                {new Date(profile.createdAt || new Date()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}
              </p>
            </div>

            <hr className="my-4" />

            {/* Verification */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Verification Status</p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    profile.isVerified ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
                <span className="font-semibold text-gray-900">
                  {profile.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
