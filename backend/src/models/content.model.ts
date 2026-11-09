import { query } from '../config/database';
import { ContentType } from '../types';

// Get or create content in database
export const getOrCreateContent = async (
  type: ContentType,
  externalId: string,
  title: string,
  description: string | null,
  year: number | null,
  posterUrl: string | null,
  metadata: any
) => {
  try {
    // Check if content already exists
    const existingContent = await query(
      'SELECT * FROM contents WHERE type = $1 AND external_id = $2',
      [type, externalId]
    );

    if (existingContent.rows.length > 0) {
      // Update existing content with latest data
      const result = await query(
        `UPDATE contents
         SET title = $1, description = $2, year = $3, poster_url = $4, metadata = $5
         WHERE type = $6 AND external_id = $7
         RETURNING *`,
        [title, description, year, posterUrl, metadata, type, externalId]
      );
      return result.rows[0];
    }

    // Create new content
    const result = await query(
      `INSERT INTO contents (type, external_id, title, description, year, poster_url, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [type, externalId, title, description, year, posterUrl, metadata]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Get or create content error:', error);
    throw error;
  }
};

// Get content by ID
export const getContentById = async (contentId: number) => {
  try {
    const result = await query('SELECT * FROM contents WHERE id = $1', [contentId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Get content by ID error:', error);
    throw error;
  }
};

// Get content with average rating
export const getContentWithRating = async (contentId: number) => {
  try {
    const result = await query(
      `SELECT
        c.id,
        c.external_id,
        c.title,
        c.description,
        c.year,
        c.poster_url as "posterUrl",
        c.type,
        c.metadata,
        c.created_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as rating_count
       FROM contents c
       LEFT JOIN ratings r ON c.id = r.content_id
       WHERE c.id = $1
       GROUP BY c.id`,
      [contentId]
    );

    if (result.rows.length === 0) return null;

    const content = result.rows[0];
    // Parse metadata if it's a string
    if (typeof content.metadata === 'string') {
      try {
        content.metadata = JSON.parse(content.metadata);
      } catch (e) {
        console.error('Error parsing metadata:', e);
      }
    }

    return content;
  } catch (error) {
    console.error('Get content with rating error:', error);
    throw error;
  }
};

// Get top rated contents on platform
export const getTopRatedContents = async (
  type?: ContentType,
  limit: number = 20,
  offset: number = 0
) => {
  try {
    let queryText = `
      SELECT
        c.id,
        c.external_id,
        c.title,
        c.description,
        c.year,
        c.poster_url as "posterUrl",
        c.type,
        c.metadata,
        c.created_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as rating_count
      FROM contents c
      LEFT JOIN ratings r ON c.id = r.content_id
    `;

    const params: any[] = [];

    if (type) {
      queryText += ' WHERE c.type = $1';
      params.push(type);
    }

    queryText += `
      GROUP BY c.id
      HAVING COUNT(r.id) >= 5
      ORDER BY AVG(r.rating) DESC, COUNT(r.id) DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
  } catch (error) {
    console.error('Get top rated contents error:', error);
    throw error;
  }
};

// Get most popular contents (most rated/reviewed)
export const getMostPopularContents = async (
  type?: ContentType,
  limit: number = 20,
  offset: number = 0
) => {
  try {
    let queryText = `
      SELECT
        c.id,
        c.external_id,
        c.title,
        c.description,
        c.year,
        c.poster_url as "posterUrl",
        c.type,
        c.metadata,
        c.created_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(DISTINCT r.id) as rating_count,
        COUNT(DISTINCT rev.id) as review_count,
        (COUNT(DISTINCT r.id) + COUNT(DISTINCT rev.id)) as popularity_score
      FROM contents c
      LEFT JOIN ratings r ON c.id = r.content_id
      LEFT JOIN reviews rev ON c.id = rev.content_id
    `;

    const params: any[] = [];

    if (type) {
      queryText += ' WHERE c.type = $1';
      params.push(type);
    }

    queryText += `
      GROUP BY c.id
      ORDER BY popularity_score DESC, rating_count DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
  } catch (error) {
    console.error('Get most popular contents error:', error);
    throw error;
  }
};

// Search contents in database
export const searchContentsInDb = async (
  searchQuery: string,
  type?: ContentType,
  limit: number = 20,
  offset: number = 0
) => {
  try {
    let queryText = `
      SELECT
        c.*,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as rating_count
      FROM contents c
      LEFT JOIN ratings r ON c.id = r.content_id
      WHERE LOWER(c.title) LIKE LOWER($1)
    `;

    const params: any[] = [`%${searchQuery}%`];

    if (type) {
      queryText += ' AND c.type = $2';
      params.push(type);
    }

    queryText += `
      GROUP BY c.id
      ORDER BY rating_count DESC, average_rating DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
  } catch (error) {
    console.error('Search contents in DB error:', error);
    throw error;
  }
};

export default {
  getOrCreateContent,
  getContentById,
  getContentWithRating,
  getTopRatedContents,
  getMostPopularContents,
  searchContentsInDb,
};
