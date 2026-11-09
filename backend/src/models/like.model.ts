import { query } from '../config/database';

// Toggle like (like if not liked, unlike if already liked)
export const toggleLike = async (userId: number, activityId: number) => {
  try {
    // Check if already liked
    const existingLike = await query(
      'SELECT id FROM likes WHERE user_id = $1 AND activity_id = $2',
      [userId, activityId]
    );

    if (existingLike.rows.length > 0) {
      // Unlike
      await query('DELETE FROM likes WHERE user_id = $1 AND activity_id = $2', [
        userId,
        activityId,
      ]);
      return { liked: false };
    } else {
      // Like
      await query('INSERT INTO likes (user_id, activity_id) VALUES ($1, $2)', [
        userId,
        activityId,
      ]);
      return { liked: true };
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    throw error;
  }
};

// Get like count for an activity
export const getLikeCount = async (activityId: number): Promise<number> => {
  try {
    const result = await query('SELECT COUNT(*) as count FROM likes WHERE activity_id = $1', [
      activityId,
    ]);
    return parseInt(result.rows[0].count);
  } catch (error) {
    console.error('Get like count error:', error);
    throw error;
  }
};

// Check if user liked an activity
export const hasUserLiked = async (userId: number, activityId: number): Promise<boolean> => {
  try {
    const result = await query(
      'SELECT id FROM likes WHERE user_id = $1 AND activity_id = $2',
      [userId, activityId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Has user liked error:', error);
    throw error;
  }
};

// Get likes for multiple activities (for feed)
export const getLikesForActivities = async (
  activityIds: number[],
  userId?: number
): Promise<{ activityId: number; likeCount: number; userLiked: boolean }[]> => {
  try {
    if (activityIds.length === 0) return [];

    const result = await query(
      `SELECT
        activity_id,
        COUNT(*) as like_count,
        BOOL_OR(user_id = $1) as user_liked
       FROM likes
       WHERE activity_id = ANY($2)
       GROUP BY activity_id`,
      [userId || null, activityIds]
    );

    // Create a map for quick lookup
    const likesMap = new Map(
      result.rows.map((row) => [
        row.activity_id,
        {
          activityId: row.activity_id,
          likeCount: parseInt(row.like_count),
          userLiked: row.user_liked || false,
        },
      ])
    );

    // Return array with default values for activities without likes
    return activityIds.map((id) => likesMap.get(id) || { activityId: id, likeCount: 0, userLiked: false });
  } catch (error) {
    console.error('Get likes for activities error:', error);
    throw error;
  }
};

export default {
  toggleLike,
  getLikeCount,
  hasUserLiked,
  getLikesForActivities,
};
