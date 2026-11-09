import api from './api';
import type { ApiResponse, Rating } from '../types';

// Create or update rating
export const createOrUpdateRating = async (contentId: number, rating: number) => {
  const response = await api.post<ApiResponse<Rating>>('/ratings', {
    content_id: contentId,
    rating,
  });
  return response.data.data;
};

// Get user's rating for a content
export const getUserRatingForContent = async (contentId: number): Promise<Rating | null> => {
  try {
    const response = await api.get<ApiResponse<Rating>>(`/ratings/user/content/${contentId}`);
    return response.data.data || null;
  } catch (error) {
    return null;
  }
};

// Get all ratings for a content
export const getRatingsForContent = async (contentId: number) => {
  const response = await api.get<ApiResponse>(`/ratings/content/${contentId}`);
  return response.data.data;
};

// Delete rating
export const deleteRating = async (ratingId: number) => {
  const response = await api.delete<ApiResponse>(`/ratings/${ratingId}`);
  return response.data;
};

export default {
  createOrUpdateRating,
  getUserRatingForContent,
  getRatingsForContent,
  deleteRating,
};
