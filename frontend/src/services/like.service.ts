import api from './api';

// Toggle like on an activity
export const toggleLike = async (activityId: number) => {
  const response = await api.post(`/likes/${activityId}`);
  return response.data;
};

// Get like count and user like status for an activity
export const getLikeInfo = async (activityId: number) => {
  const response = await api.get(`/likes/${activityId}`);
  return response.data;
};

export default {
  toggleLike,
  getLikeInfo,
};
