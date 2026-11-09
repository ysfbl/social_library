import express from 'express';
import {
  getUserLists,
  getListItemsByType,
  addToLibrary,
  removeFromLibrary,
  createCustomList,
  getUserCustomLists,
  updateCustomList,
  deleteCustomList,
  addItemToCustomList,
} from '../controllers/library.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Add content to library (requires auth)
router.post('/add', authenticate, addToLibrary);

// Remove content from library (requires auth)
router.post('/remove', authenticate, removeFromLibrary);

// Custom lists - must come BEFORE /:userId routes to avoid conflicts
router.get('/custom/:userId', getUserCustomLists);
router.post('/custom', authenticate, createCustomList);
router.put('/custom/:id', authenticate, updateCustomList);
router.delete('/custom/:id', authenticate, deleteCustomList);

// Add item to custom list (requires auth)
router.post('/custom/:listId/items', authenticate, addItemToCustomList);

// Get user's all lists (public)
router.get('/:userId', getUserLists);

// Get list items by type (public)
router.get('/:userId/:type', getListItemsByType);

export default router;
