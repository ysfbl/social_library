import api from './api';
import type { ApiResponse, Activity } from '../types';

// Get feed (activities from followed users)
export const getFeed = async (page: number = 1, limit: number = 15) => {
  const response = await api.get('/feed', {
    params: { page, limit },
  });
  return response.data; // Return full response with hasMore flag
};

// Get user's activities
export const getUserActivities = async (userId: number, page: number = 1, limit: number = 20) => {
  const response = await api.get<ApiResponse<Activity[]>>(`/feed/user/${userId}`, {
    params: { page, limit },
  });
  return response.data.data || [];
};

export default {
  getFeed,
  getUserActivities,
};
