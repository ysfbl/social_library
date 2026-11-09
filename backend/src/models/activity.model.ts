import { query } from '../config/database';
import { ActivityType } from '../types';

// Create activity
export const createActivity = async (
  userId: number,
  type: ActivityType,
  contentId: number,
  metadata?: any
) => {
  try {
    const result = await query(
      'INSERT INTO activities (user_id, type, content_id, metadata) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, type, contentId, metadata ? JSON.stringify(metadata) : null]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Create activity error:', error);
    throw error;
  }
};

// Get activities for user's feed (only from followed users + own activities)
export const getFeedActivities = async (
  userId: number,
  limit: number = 15,
  offset: number = 0
) => {
  try {
    const result = await query(
      `SELECT
        a.id,
        a.user_id,
        a.type as activity_type,
        a.content_id,
        a.metadata,
        a.created_at,
        u.username,
        u.avatar,
        u.avatar_id,
        c.title as content_title,
        c.year as content_year,
        c.poster_url as poster_url,
        c.type as content_type,
        c.external_id,
        COUNT(l.id) as like_count,
        BOOL_OR(l.user_id = $1) as user_liked
       FROM activities a
       JOIN users u ON a.user_id = u.id
       JOIN contents c ON a.content_id = c.id
       LEFT JOIN likes l ON l.activity_id = a.id
       WHERE a.user_id IN (
         SELECT following_id FROM follows WHERE follower_id = $1
       )
       OR a.user_id = $1
       GROUP BY a.id, u.id, c.id
       ORDER BY a.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // Map metadata fields to top level for easier access
    return result.rows.map(row => ({
      ...row,
      rating: row.metadata?.rating,
      review_text: row.metadata?.review_text,
      list_name: row.metadata?.list_name,
      like_count: parseInt(row.like_count) || 0,
      user_liked: row.user_liked || false,
    }));
  } catch (error) {
    console.error('Get feed activities error:', error);
    throw error;
  }
};

// Get user's activities
export const getUserActivities = async (
  userId: number,
  limit: number = 20,
  offset: number = 0
) => {
  try {
    const result = await query(
      `SELECT
        a.id,
        a.user_id,
        a.type as activity_type,
        a.content_id,
        a.metadata,
        a.created_at,
        u.username,
        u.avatar,
        u.avatar_id,
        c.title as content_title,
        c.year as content_year,
        c.poster_url as poster_url,
        c.type as content_type,
        c.external_id
       FROM activities a
       JOIN users u ON a.user_id = u.id
       JOIN contents c ON a.content_id = c.id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    // Map metadata fields to top level for easier access
    return result.rows.map(row => ({
      ...row,
      rating: row.metadata?.rating,
      review_text: row.metadata?.review_text,
      list_name: row.metadata?.list_name,
    }));
  } catch (error) {
    console.error('Get user activities error:', error);
    throw error;
  }
};

// Delete activity
export const deleteActivity = async (activityId: number) => {
  try {
    const result = await query('DELETE FROM activities WHERE id = $1 RETURNING *', [activityId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Delete activity error:', error);
    throw error;
  }
};

export default {
  createActivity,
  getFeedActivities,
  getUserActivities,
  deleteActivity,
};
