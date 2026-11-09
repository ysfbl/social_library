import { query } from '../config/database';
import { ListType } from '../types';

// Get user's lists
export const getUserLists = async (userId: number) => {
  try {
    const result = await query('SELECT * FROM lists WHERE user_id = $1 ORDER BY created_at', [
      userId,
    ]);
    return result.rows;
  } catch (error) {
    console.error('Get user lists error:', error);
    throw error;
  }
};

// Get list by type
export const getListByType = async (userId: number, type: ListType) => {
  try {
    const result = await query('SELECT * FROM lists WHERE user_id = $1 AND type = $2', [
      userId,
      type,
    ]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Get list by type error:', error);
    throw error;
  }
};

// Get list by ID
export const getListById = async (listId: number) => {
  try {
    const result = await query('SELECT * FROM lists WHERE id = $1', [listId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Get list by ID error:', error);
    throw error;
  }
};

// Get list items with content details
export const getListItems = async (listId: number) => {
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
        li.added_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as rating_count
       FROM list_items li
       JOIN contents c ON li.content_id = c.id
       LEFT JOIN ratings r ON c.id = r.content_id
       WHERE li.list_id = $1
       GROUP BY c.id, li.id
       ORDER BY li.added_at DESC`,
      [listId]
    );
    return result.rows;
  } catch (error) {
    console.error('Get list items error:', error);
    throw error;
  }
};

// Add item to list
export const addItemToList = async (listId: number, contentId: number) => {
  try {
    // Check if item already exists
    const existing = await query(
      'SELECT id FROM list_items WHERE list_id = $1 AND content_id = $2',
      [listId, contentId]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const result = await query(
      'INSERT INTO list_items (list_id, content_id) VALUES ($1, $2) RETURNING *',
      [listId, contentId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Add item to list error:', error);
    throw error;
  }
};

// Remove item from list
export const removeItemFromList = async (listId: number, contentId: number) => {
  try {
    const result = await query(
      'DELETE FROM list_items WHERE list_id = $1 AND content_id = $2 RETURNING *',
      [listId, contentId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Remove item from list error:', error);
    throw error;
  }
};

// Check if item is in list
export const isItemInList = async (listId: number, contentId: number) => {
  try {
    const result = await query(
      'SELECT id FROM list_items WHERE list_id = $1 AND content_id = $2',
      [listId, contentId]
    );
    return result.rows.length > 0;
  } catch (error) {
    console.error('Check item in list error:', error);
    throw error;
  }
};

// Create custom list
export const createCustomList = async (userId: number, name: string, description?: string) => {
  try {
    const result = await query(
      'INSERT INTO lists (user_id, name, type, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, ListType.CUSTOM, description || null]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Create custom list error:', error);
    throw error;
  }
};

// Update custom list
export const updateCustomList = async (
  listId: number,
  name: string,
  description?: string
) => {
  try {
    const result = await query(
      'UPDATE lists SET name = $1, description = $2 WHERE id = $3 AND type = $4 RETURNING *',
      [name, description || null, listId, ListType.CUSTOM]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Update custom list error:', error);
    throw error;
  }
};

// Delete custom list
export const deleteCustomList = async (listId: number) => {
  try {
    const result = await query(
      'DELETE FROM lists WHERE id = $1 AND type = $2 RETURNING *',
      [listId, ListType.CUSTOM]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Delete custom list error:', error);
    throw error;
  }
};

// Get user's custom lists
export const getUserCustomLists = async (userId: number) => {
  try {
    const result = await query(
      `SELECT
        l.*,
        COUNT(li.id) as item_count
       FROM lists l
       LEFT JOIN list_items li ON l.id = li.list_id
       WHERE l.user_id = $1 AND l.type = $2
       GROUP BY l.id
       ORDER BY l.created_at DESC`,
      [userId, ListType.CUSTOM]
    );
    return result.rows;
  } catch (error) {
    console.error('Get user custom lists error:', error);
    throw error;
  }
};

export default {
  getUserLists,
  getListByType,
  getListById,
  getListItems,
  addItemToList,
  removeItemFromList,
  isItemInList,
  createCustomList,
  updateCustomList,
  deleteCustomList,
  getUserCustomLists,
};
