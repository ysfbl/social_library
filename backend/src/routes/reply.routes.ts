import express from 'express';
import {
  createReply,
  getRepliesForReview,
  updateReply,
  deleteReply,
  likeReply,
  unlikeReply,
} from '../controllers/reply.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Create reply for a review (requires auth)
router.post('/review/:reviewId', authenticate, createReply);

// Get replies for a review (public)
router.get('/review/:reviewId', optionalAuthenticate, getRepliesForReview);

// Like/unlike reply (requires auth) - must come BEFORE /:id routes
router.post('/:id/like', authenticate, likeReply);
router.delete('/:id/like', authenticate, unlikeReply);

// Update reply (requires auth)
router.put('/:id', authenticate, updateReply);

// Delete reply (requires auth)
router.delete('/:id', authenticate, deleteReply);

export default router;
