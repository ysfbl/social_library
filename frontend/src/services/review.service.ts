import api from './api';
import type { ApiResponse, Review, PaginatedResponse } from '../types';

// Create review
export const createReview = async (contentId: number, text: string) => {
  const response = await api.post<ApiResponse<Review>>('/reviews', {
    content_id: contentId,
    text,
  });
  return response.data.data;
};

// Get reviews for content
export const getReviewsForContent = async (contentId: number, page: number = 1, limit: number = 20) => {
  const response = await api.get<PaginatedResponse<Review>>(`/reviews/content/${contentId}`, {
    params: { page, limit },
  });
  return response.data;
};

// Update review
export const updateReview = async (reviewId: number, text: string) => {
  const response = await api.put<ApiResponse<Review>>(`/reviews/${reviewId}`, { text });
  return response.data.data;
};

// Delete review
export const deleteReview = async (reviewId: number) => {
  const response = await api.delete<ApiResponse>(`/reviews/${reviewId}`);
  return response.data;
};

// Like review
export const likeReview = async (reviewId: number) => {
  const response = await api.post<ApiResponse>(`/reviews/${reviewId}/like`);
  return response.data;
};

// Unlike review
export const unlikeReview = async (reviewId: number) => {
  const response = await api.delete<ApiResponse>(`/reviews/${reviewId}/like`);
  return response.data;
};

export default {
  createReview,
  getReviewsForContent,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
};
