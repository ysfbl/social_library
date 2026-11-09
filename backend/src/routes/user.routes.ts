import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from '../controllers/user.controller';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Get user profile (public but shows follow status if authenticated)
router.get('/:userId', optionalAuthenticate, getUserProfile);

// Update user profile (requires auth)
router.put('/profile', authenticate, updateUserProfile);

// Follow/unfollow user (requires auth)
router.post('/:userId/follow', authenticate, followUser);
router.delete('/:userId/follow', authenticate, unfollowUser);

// Get followers and following (public)
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

export default router;
