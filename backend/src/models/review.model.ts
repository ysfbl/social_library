import { query } from '../config/database';

// Create review
export const createReview = async (userId: number, contentId: number, text: string) => {
  try {
    const result = await query(
      'INSERT INTO reviews (user_id, content_id, text) VALUES ($1, $2, $3) RETURNING *',
      [userId, contentId, text]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Create review error:', error);
    throw error;
  }
};

// Get review by ID
export const getReviewById = async (reviewId: number) => {
  try {
    const result = await query(
      `SELECT r.*, u.username, u.avatar, u.avatar_id
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = $1`,
      [reviewId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Get review by ID error:', error);
    throw error;
  }
};

// Get all reviews for a content with like counts and reply counts
export const getReviewsForContent = async (
  contentId: number,
  limit: number = 20,
  offset: number = 0
) => {
  try {
    const result = await query(
      `SELECT
        r.*,
        u.username,
        u.avatar,
        u.avatar_id,
        COUNT(DISTINCT rl.id) as like_count,
        COUNT(DISTINCT rr.id) as reply_count
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN review_likes rl ON r.id = rl.review_id
       LEFT JOIN review_replies rr ON r.id = rr.review_id
       WHERE r.content_id = $1
       GROUP BY r.id, u.id
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [contentId, limit, offset]
    );
    return result.rows;
  } catch (error) {
    console.error('Get reviews for content error:', error);
    throw error;
  }
};

// Get all reviews by user
export const getReviewsByUser = async (
  userId: number,
  limit: number = 20,
  offset: number = 0
) => {
  try {
    const result = await query(
      `SELECT r.*, c.title, c.poster_url, c.type
       FROM reviews r
       JOIN contents c ON r.content_id = c.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  } catch (error) {
    console.error('Get reviews by user error:', error);
    throw error;
  }
};

// Update review
export const updateReview = async (reviewId: number, text: string) => {
  try {
    const result = await query(
      'UPDATE reviews SET text = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [text, reviewId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Update review error:', error);
    throw error;
  }
};

// Delete review
export const deleteReview = async (reviewId: number) => {
  try {
    const result = await query('DELETE FROM reviews WHERE id = $1 RETURNING *', [reviewId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
};

// Get review count for content
export const getReviewCountForContent = async (contentId: number) => {
  try {
    const result = await query(
      'SELECT COUNT(id) as review_count FROM reviews WHERE content_id = $1',
      [contentId]
    );
    return parseInt(result.rows[0].review_count);
  } catch (error) {
    console.error('Get review count for content error:', error);
    throw error;
  }
};

// Like a review
export const likeReview = async (userId: number, reviewId: number) => {
  try {
    // Check if already liked
    const existing = await query(
      'SELECT id FROM review_likes WHERE user_id = $1 AND review_id = $2',
      [userId, reviewId]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const result = await query(
      'INSERT INTO review_likes (user_id, review_id) VALUES ($1, $2) RETURNING *',
      [userId, reviewId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Like review error:', error);
    throw error;
  }
};

// Unlike a review
export const unlikeReview = async (userId: number, reviewId: number) => {
  try {
    const result = await query(
      'DELETE FROM review_likes WHERE user_id = $1 AND review_id = $2 RETURNING *',
      [userId, reviewId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Unlike review error:', error);
    throw error;
  }
};

// Check if user has liked a review
export const hasUserLikedReview = async (userId: number, reviewId: number) => {
  try {
    const result = await query(
      'SELECT id FROM review_likes WHERE user_id = $1 AND review_id = $2',
      [userId, reviewId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Check user liked review error:', error);
    throw error;
  }
};

// Get like count for a review
export const getReviewLikeCount = async (reviewId: number) => {
  try {
    const result = await query(
      'SELECT COUNT(id) as like_count FROM review_likes WHERE review_id = $1',
      [reviewId]
    );
    return parseInt(result.rows[0].like_count);
  } catch (error) {
    console.error('Get review like count error:', error);
    throw error;
  }
};

// Get users who liked a review
export const getReviewLikers = async (reviewId: number) => {
  try {
    const result = await query(
      `SELECT u.id, u.username, u.avatar, u.avatar_id
       FROM review_likes rl
       JOIN users u ON rl.user_id = u.id
       WHERE rl.review_id = $1
       ORDER BY rl.created_at DESC`,
      [reviewId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get review likers error:', error);
    throw error;
  }
};

export default {
  createReview,
  getReviewById,
  getReviewsForContent,
  getReviewsByUser,
  updateReview,
  deleteReview,
  getReviewCountForContent,
  likeReview,
  unlikeReview,
  hasUserLikedReview,
  getReviewLikeCount,
  getReviewLikers,
};
