import express from 'express';
import {
  createOrUpdateRating,
  getUserRatingForContent,
  getRatingsForContent,
  getUserRatings,
  deleteRating,
} from '../controllers/rating.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Create or update rating (requires auth)
router.post('/', authenticate, createOrUpdateRating);

// Get user's rating for a specific content (requires auth)
router.get('/user/content/:contentId', authenticate, getUserRatingForContent);

// Get all ratings for a content (public)
router.get('/content/:contentId', getRatingsForContent);

// Get user's all ratings (public)
router.get('/user/:userId', getUserRatings);

// Delete rating (requires auth)
router.delete('/:id', authenticate, deleteRating);

export default router;
