import { query } from '../config/database';

// Get user by ID
export const getUserById = async (userId: number) => {
  try {
    const result = await query(
      'SELECT id, username, email, avatar, avatar_id, bio, created_at FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Get user by ID error:', error);
    throw error;
  }
};

// Get user by username
export const getUserByUsername = async (username: string) => {
  try {
    const result = await query(
      'SELECT id, username, email, avatar, avatar_id, bio, created_at FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Get user by username error:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: number,
  username?: string,
  bio?: string,
  avatar?: string,
  avatar_id?: number
) => {
  try {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (username) {
      updates.push(`username = $${paramCount}`);
      values.push(username);
      paramCount++;
    }

    if (bio !== undefined) {
      updates.push(`bio = $${paramCount}`);
      values.push(bio);
      paramCount++;
    }

    if (avatar !== undefined) {
      updates.push(`avatar = $${paramCount}`);
      values.push(avatar);
      paramCount++;
    }

    if (avatar_id !== undefined) {
      updates.push(`avatar_id = $${paramCount}`);
      values.push(avatar_id);
      paramCount++;
    }

    updates.push('updated_at = NOW()');
    values.push(userId);

    const result = await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, username, email, avatar, avatar_id, bio, created_at`,
      values
    );

    return result.rows[0];
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

// Follow user
export const followUser = async (followerId: number, followingId: number) => {
  try {
    // Check if already following
    const existing = await query(
      'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const result = await query(
      'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) RETURNING *',
      [followerId, followingId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Follow user error:', error);
    throw error;
  }
};

// Unfollow user
export const unfollowUser = async (followerId: number, followingId: number) => {
  try {
    const result = await query(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING *',
      [followerId, followingId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Unfollow user error:', error);
    throw error;
  }
};

// Check if user is following another user
export const isFollowing = async (followerId: number, followingId: number) => {
  try {
    const result = await query(
      'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Check is following error:', error);
    throw error;
  }
};

// Get user's followers
export const getFollowers = async (userId: number) => {
  try {
    const result = await query(
      `SELECT u.id, u.username, u.avatar, u.avatar_id, u.bio, f.created_at as followed_at
       FROM follows f
       JOIN users u ON f.follower_id = u.id
       WHERE f.following_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get followers error:', error);
    throw error;
  }
};

// Get users that user is following
export const getFollowing = async (userId: number) => {
  try {
    const result = await query(
      `SELECT u.id, u.username, u.avatar, u.avatar_id, u.bio, f.created_at as followed_at
       FROM follows f
       JOIN users u ON f.following_id = u.id
       WHERE f.follower_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get following error:', error);
    throw error;
  }
};

// Get follower and following counts
export const getFollowCounts = async (userId: number) => {
  try {
    const followerResult = await query(
      'SELECT COUNT(*) as follower_count FROM follows WHERE following_id = $1',
      [userId]
    );
    const followingResult = await query(
      'SELECT COUNT(*) as following_count FROM follows WHERE follower_id = $1',
      [userId]
    );

    return {
      follower_count: parseInt(followerResult.rows[0].follower_count),
      following_count: parseInt(followingResult.rows[0].following_count),
    };
  } catch (error) {
    console.error('Get follow counts error:', error);
    throw error;
  }
};

export default {
  getUserById,
  getUserByUsername,
  updateUserProfile,
  followUser,
  unfollowUser,
  isFollowing,
  getFollowers,
  getFollowing,
  getFollowCounts,
};
