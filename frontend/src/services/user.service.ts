import api from './api';
import type { ApiResponse, User } from '../types';

// Get user profile
export const getUserProfile = async (userId: number) => {
  const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
  return response.data.data;
};

// Update user profile
export const updateUserProfile = async (data: { bio?: string; avatar_id?: number }) => {
  const response = await api.put<ApiResponse<User>>('/users/profile', data);
  return response.data.data;
};

// Follow user
export const followUser = async (userId: number) => {
  const response = await api.post<ApiResponse>(`/users/${userId}/follow`);
  return response.data;
};

// Unfollow user
export const unfollowUser = async (userId: number) => {
  const response = await api.delete<ApiResponse>(`/users/${userId}/unfollow`);
  return response.data;
};

// Get followers
export const getFollowers = async (userId: number) => {
  const response = await api.get<ApiResponse<User[]>>(`/users/${userId}/followers`);
  return response.data.data || [];
};

// Get following
export const getFollowing = async (userId: number) => {
  const response = await api.get<ApiResponse<User[]>>(`/users/${userId}/following`);
  return response.data.data || [];
};

export default {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
