import { query } from '../config/database';

// Create reply
export const createReply = async (userId: number, reviewId: number, text: string) => {
  try {
    const result = await query(
      'INSERT INTO review_replies (user_id, review_id, text) VALUES ($1, $2, $3) RETURNING *',
      [userId, reviewId, text]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Create reply error:', error);
    throw error;
  }
};

// Get replies for a review with like counts
export const getRepliesForReview = async (reviewId: number) => {
  try {
    const result = await query(
      `SELECT
        rr.*,
        u.username,
        u.avatar,
        u.avatar_id,
        COUNT(DISTINCT rrl.id) as like_count
       FROM review_replies rr
       JOIN users u ON rr.user_id = u.id
       LEFT JOIN review_reply_likes rrl ON rr.id = rrl.reply_id
       WHERE rr.review_id = $1
       GROUP BY rr.id, u.id
       ORDER BY rr.created_at ASC`,
      [reviewId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get replies for review error:', error);
    throw error;
  }
};

// Get reply by ID
export const getReplyById = async (replyId: number) => {
  try {
    const result = await query(
      `SELECT rr.*, u.username, u.avatar, u.avatar_id
       FROM review_replies rr
       JOIN users u ON rr.user_id = u.id
       WHERE rr.id = $1`,
      [replyId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Get reply by ID error:', error);
    throw error;
  }
};

// Update reply
export const updateReply = async (replyId: number, text: string) => {
  try {
    const result = await query(
      'UPDATE review_replies SET text = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [text, replyId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Update reply error:', error);
    throw error;
  }
};

// Delete reply
export const deleteReply = async (replyId: number) => {
  try {
    const result = await query('DELETE FROM review_replies WHERE id = $1 RETURNING *', [replyId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Delete reply error:', error);
    throw error;
  }
};

// Get reply count for a review
export const getReplyCountForReview = async (reviewId: number) => {
  try {
    const result = await query(
      'SELECT COUNT(id) as reply_count FROM review_replies WHERE review_id = $1',
      [reviewId]
    );
    return parseInt(result.rows[0].reply_count);
  } catch (error) {
    console.error('Get reply count for review error:', error);
    throw error;
  }
};

// Like a reply
export const likeReply = async (userId: number, replyId: number) => {
  try {
    // Check if already liked
    const existing = await query(
      'SELECT id FROM review_reply_likes WHERE user_id = $1 AND reply_id = $2',
      [userId, replyId]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const result = await query(
      'INSERT INTO review_reply_likes (user_id, reply_id) VALUES ($1, $2) RETURNING *',
      [userId, replyId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Like reply error:', error);
    throw error;
  }
};

// Unlike a reply
export const unlikeReply = async (userId: number, replyId: number) => {
  try {
    const result = await query(
      'DELETE FROM review_reply_likes WHERE user_id = $1 AND reply_id = $2 RETURNING *',
      [userId, replyId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Unlike reply error:', error);
    throw error;
  }
};

// Check if user has liked a reply
export const hasUserLikedReply = async (userId: number, replyId: number) => {
  try {
    const result = await query(
      'SELECT id FROM review_reply_likes WHERE user_id = $1 AND reply_id = $2',
      [userId, replyId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Check user liked reply error:', error);
    throw error;
  }
};

export default {
  createReply,
  getRepliesForReview,
  getReplyById,
  updateReply,
  deleteReply,
  getReplyCountForReview,
  likeReply,
  unlikeReply,
  hasUserLikedReply,
};
