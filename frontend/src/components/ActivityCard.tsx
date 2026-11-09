import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { Activity } from '../types';
import { ActivityType } from '../types';
import { getRelativeTime } from '../utils/dateUtils';
import { toggleLike } from '../services/like.service';
import Avatar from './Avatar';

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  const [liked, setLiked] = useState(activity.user_liked || false);
  const [likeCount, setLikeCount] = useState(activity.like_count || 0);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await toggleLike(activity.id);
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Beğeni işlemi başarısız');
      console.error('Like error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityText = () => {
    switch (activity.activity_type) {
      case ActivityType.RATING:
        return (
          <>
            <span className="font-semibold">{activity.rating}</span> puan verdi
          </>
        );
      case ActivityType.REVIEW:
        return 'yorum yaptı';
      case ActivityType.ADD_TO_LIST:
        return (
          <>
            kütüphaneye ekledi (<span className="font-semibold">{activity.list_name}</span>)
          </>
        );
      default:
        return 'aktivite';
    }
  };

  const getActivityIcon = () => {
    switch (activity.activity_type) {
      case ActivityType.RATING:
        return '⭐';
      case ActivityType.REVIEW:
        return '💬';
      case ActivityType.ADD_TO_LIST:
        return '📚';
      default:
        return '📝';
    }
  };

  // Render star rating visual (e.g., 8/10 → ★★★★☆☆☆☆☆☆)
  const renderStarRating = (rating: number) => {
    const stars = [];
    const maxStars = 10;

    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-400' : 'text-gray-600'}>
          {i <= rating ? '★' : '☆'}
        </span>
      );
    }

    return stars;
  };

  // Truncate review text and check if it needs "read more"
  const getTruncatedReview = (text: string, maxLength: number = 180) => {
    if (!text) return { text: '', needsReadMore: false };

    if (text.length <= maxLength) {
      return { text, needsReadMore: false };
    }

    // Find last space before maxLength to avoid cutting words
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    const finalText = lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;

    return { text: finalText, needsReadMore: true };
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20">
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <Link to={`/profile/${activity.user_id}`} className="flex-shrink-0">
          <div className="cursor-pointer hover:opacity-80 transition-opacity">
            <Avatar
              avatar_id={activity.avatar_id}
              username={activity.username}
              size="sm"
            />
          </div>
        </Link>

        {/* Activity Content */}
        <div className="flex-1">
          {/* User and Action */}
          <div className="mb-3">
            <Link
              to={`/profile/${activity.user_id}`}
              className="font-semibold text-white hover:text-red-500 transition-colors"
            >
              {activity.username}
            </Link>
            <span className="text-gray-400 ml-2">
              {getActivityText()}
            </span>
            {activity.activity_type === ActivityType.RATING && (
              <span className="ml-2 text-yellow-400">
                {getActivityIcon()}
              </span>
            )}
          </div>

          {/* Content Info */}
          <Link
            to={`/content/${activity.content_type}/${activity.external_id}`}
            className="block group"
          >
            <div className="flex items-start space-x-4 bg-black/50 rounded-lg p-4 hover:bg-black/70 transition-colors">
              {/* Content Poster */}
              {activity.poster_url ? (
                <img
                  src={activity.poster_url}
                  alt={activity.content_title}
                  className="w-28 h-40 object-cover rounded shadow-lg flex-shrink-0"
                />
              ) : (
                <div className="w-28 h-40 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 text-xs">Resim yok</span>
                </div>
              )}

              {/* Content Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white group-hover:text-red-500 transition-colors text-lg mb-1">
                  {activity.content_title}
                </h3>
                <div className="flex items-center space-x-3 mb-2">
                  {activity.content_year && (
                    <p className="text-sm text-gray-400">{activity.content_year}</p>
                  )}
                  <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                    activity.content_type === 'movie'
                      ? 'bg-blue-600 text-white'
                      : 'bg-green-600 text-white'
                  }`}>
                    {activity.content_type === 'movie' ? 'FİLM' : 'KİTAP'}
                  </span>
                </div>

                {/* Rating Visual Display */}
                {activity.activity_type === ActivityType.RATING && activity.rating && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-yellow-400">{activity.rating}/10</span>
                    </div>
                    <div className="flex space-x-1 text-xl">
                      {renderStarRating(activity.rating)}
                    </div>
                  </div>
                )}

                {/* Review Text with Read More */}
                {activity.activity_type === ActivityType.REVIEW && activity.review_text && (() => {
                  const { text, needsReadMore } = getTruncatedReview(activity.review_text);
                  return (
                    <div className="mt-3">
                      <p className="text-gray-300 text-sm italic leading-relaxed">
                        "{text}
                        {needsReadMore && '...'}
                      </p>
                      {needsReadMore && (
                        <Link
                          to={`/content/${activity.content_type}/${activity.external_id}`}
                          className="inline-block mt-2 text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          daha fazla oku →
                        </Link>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </Link>

          {/* Timestamp */}
          <div className="mt-3 text-xs text-gray-500">
            {getRelativeTime(activity.created_at)}
          </div>

          {/* Footer - Interaction Buttons */}
          <div className="mt-4 flex items-center space-x-4 pt-3 border-t border-gray-800">
            <button
              onClick={handleLike}
              disabled={loading}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                liked
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <svg
                className="w-4 h-4"
                fill={liked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-sm font-medium">
                {likeCount > 0 ? likeCount : 'Beğen'}
              </span>
            </button>

            <Link
              to={`/content/${activity.content_type}/${activity.external_id}`}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-sm font-medium">Yorum Yap</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
