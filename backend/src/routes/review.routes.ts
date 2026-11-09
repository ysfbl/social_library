import express from 'express';
import {
  createReview,
  getReviewsForContent,
  getUserReviews,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
} from '../controllers/review.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Create review (requires auth)
router.post('/', authenticate, createReview);

// Get reviews for a content (public, with pagination)
router.get('/content/:contentId', optionalAuthenticate, getReviewsForContent);

// Get user's reviews (public, with pagination)
router.get('/user/:userId', getUserReviews);

// Like/unlike review (requires auth) - must come BEFORE /:id routes
router.post('/:id/like', authenticate, likeReview);
router.delete('/:id/like', authenticate, unlikeReview);

// Update review (requires auth)
router.put('/:id', authenticate, updateReview);

// Delete review (requires auth)
router.delete('/:id', authenticate, deleteReview);

export default router;
