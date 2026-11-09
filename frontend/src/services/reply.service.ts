import api from './api';
import type { ApiResponse, Reply } from '../types';

// Create reply
export const createReply = async (reviewId: number, text: string) => {
  const response = await api.post<ApiResponse<Reply>>(`/replies/review/${reviewId}`, { text });
  return response.data.data;
};

// Get replies for a review
export const getRepliesForReview = async (reviewId: number) => {
  const response = await api.get<ApiResponse<Reply[]>>(`/replies/review/${reviewId}`);
  return response.data.data || [];
};

// Update reply
export const updateReply = async (replyId: number, text: string) => {
  const response = await api.put<ApiResponse<Reply>>(`/replies/${replyId}`, { text });
  return response.data.data;
};

// Delete reply
export const deleteReply = async (replyId: number) => {
  const response = await api.delete<ApiResponse>(`/replies/${replyId}`);
  return response.data;
};

// Like reply
export const likeReply = async (replyId: number) => {
  const response = await api.post<ApiResponse>(`/replies/${replyId}/like`);
  return response.data;
};

// Unlike reply
export const unlikeReply = async (replyId: number) => {
  const response = await api.delete<ApiResponse>(`/replies/${replyId}/like`);
  return response.data;
};

export default {
  createReply,
  getRepliesForReview,
  updateReply,
  deleteReply,
  likeReply,
  unlikeReply,
};
