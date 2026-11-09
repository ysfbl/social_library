import { query } from '../config/database';

// Create or update rating
export const createOrUpdateRating = async (
  userId: number,
  contentId: number,
  rating: number
) => {
  try {
    // Check if rating already exists
    const existing = await query(
      'SELECT id FROM ratings WHERE user_id = $1 AND content_id = $2',
      [userId, contentId]
    );

    if (existing.rows.length > 0) {
      // Update existing rating
      const result = await query(
        'UPDATE ratings SET rating = $1, updated_at = NOW() WHERE user_id = $2 AND content_id = $3 RETURNING *',
        [rating, userId, contentId]
      );
      return result.rows[0];
    } else {
      // Create new rating
      const result = await query(
        'INSERT INTO ratings (user_id, content_id, rating) VALUES ($1, $2, $3) RETURNING *',
        [userId, contentId, rating]
      );
      return result.rows[0];
    }
  } catch (error) {
    console.error('Create or update rating error:', error);
    throw error;
  }
};

// Get rating by ID
export const getRatingById = async (ratingId: number) => {
  try {
    const result = await query('SELECT * FROM ratings WHERE id = $1', [ratingId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Get rating by ID error:', error);
    throw error;
  }
};

// Get user's rating for a content
export const getUserRatingForContent = async (userId: number, contentId: number) => {
  try {
    const result = await query(
      'SELECT * FROM ratings WHERE user_id = $1 AND content_id = $2',
      [userId, contentId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Get user rating for content error:', error);
    throw error;
  }
};

// Get all ratings for a content
export const getRatingsForContent = async (contentId: number) => {
  try {
    const result = await query(
      `SELECT r.*, u.username, u.avatar
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.content_id = $1
       ORDER BY r.created_at DESC`,
      [contentId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get ratings for content error:', error);
    throw error;
  }
};

// Get all ratings by user
export const getRatingsByUser = async (userId: number) => {
  try {
    const result = await query(
      `SELECT r.*, c.title, c.poster_url, c.type
       FROM ratings r
       JOIN contents c ON r.content_id = c.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get ratings by user error:', error);
    throw error;
  }
};

// Delete rating
export const deleteRating = async (ratingId: number) => {
  try {
    const result = await query('DELETE FROM ratings WHERE id = $1 RETURNING *', [ratingId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Delete rating error:', error);
    throw error;
  }
};

// Get average rating for content
export const getAverageRatingForContent = async (contentId: number) => {
  try {
    const result = await query(
      `SELECT
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(id) as rating_count
       FROM ratings
       WHERE content_id = $1`,
      [contentId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Get average rating for content error:', error);
    throw error;
  }
};

export default {
  createOrUpdateRating,
  getRatingById,
  getUserRatingForContent,
  getRatingsForContent,
  getRatingsByUser,
  deleteRating,
  getAverageRatingForContent,
};
