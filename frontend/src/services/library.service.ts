import api from './api';
import type { ApiResponse, List, ListType } from '../types';

// Add content to library
export const addToLibrary = async (listType: ListType, contentId: number) => {
  const response = await api.post<ApiResponse>('/library/add', {
    list_type: listType,
    content_id: contentId,
  });
  return response.data;
};

// Remove content from library
export const removeFromLibrary = async (listType: ListType, contentId: number) => {
  const response = await api.post<ApiResponse>('/library/remove', {
    list_type: listType,
    content_id: contentId,
  });
  return response.data;
};

// Get user's lists
export const getUserLists = async (userId: number) => {
  const response = await api.get<ApiResponse<List[]>>(`/library/${userId}`);
  return response.data.data || [];
};

// Get list items by type
export const getListItemsByType = async (userId: number, type: ListType) => {
  const response = await api.get<ApiResponse>(`/library/${userId}/${type}`);
  return response.data.data?.items || [];
};

// Create custom list
export const createCustomList = async (name: string, description?: string) => {
  const response = await api.post<ApiResponse<List>>('/library/custom', { name, description });
  return response.data.data;
};

// Get user's custom lists
export const getUserCustomLists = async (userId: number) => {
  const response = await api.get<ApiResponse<List[]>>(`/library/custom/${userId}`);
  return response.data.data || [];
};

// Add content to custom list
export const addToCustomList = async (listId: number, contentId: number) => {
  const response = await api.post<ApiResponse>(`/library/custom/${listId}/add`, {
    content_id: contentId,
  });
  return response.data;
};

export default {
  addToLibrary,
  removeFromLibrary,
  getUserLists,
  getListItemsByType,
  createCustomList,
  getUserCustomLists,
  addToCustomList,
};
