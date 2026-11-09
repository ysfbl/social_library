import express from 'express';
import { getFeed, getUserActivities } from '../controllers/feed.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Get feed (requires auth)
router.get('/', authenticate, getFeed);

// Get user's activities (public)
router.get('/user/:userId', getUserActivities);

export default router;
