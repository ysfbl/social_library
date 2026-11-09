import express from 'express';
import { toggleLike, getLikeCount } from '../controllers/like.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Toggle like on an activity
router.post('/:activityId', authenticate, toggleLike);

// Get like count and user like status
router.get('/:activityId', getLikeCount);

export default router;
