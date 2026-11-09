import { Request, Response } from 'express';
import * as userModel from '../models/user.model';

// Get user profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const user = await userModel.getUserById(parseInt(userId));

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı',
      });
      return;
    }

    // Get follow counts
    const followCounts = await userModel.getFollowCounts(parseInt(userId));

    // Check if current user is following this user
    let isFollowing = false;
    if (req.user) {
      isFollowing = await userModel.isFollowing(req.user.userId, parseInt(userId));
    }

    res.status(200).json({
      success: true,
      data: {
        ...user,
        ...followCounts,
        is_following: isFollowing,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı profili alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { username, bio, avatar, avatar_id } = req.body;

    const updatedUser = await userModel.updateUserProfile(
      req.user.userId,
      username,
      bio,
      avatar,
      avatar_id
    );

    res.status(200).json({
      success: true,
      message: 'Profil güncellendi',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Profil güncellenirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Follow user
export const followUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { userId } = req.params;
    const followingId = parseInt(userId);

    if (followingId === req.user.userId) {
      res.status(400).json({
        success: false,
        message: 'Kendinizi takip edemezsiniz',
      });
      return;
    }

    // Check if user exists
    const userToFollow = await userModel.getUserById(followingId);
    if (!userToFollow) {
      res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı',
      });
      return;
    }

    await userModel.followUser(req.user.userId, followingId);

    res.status(200).json({
      success: true,
      message: 'Kullanıcı takip edildi',
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Takip edilirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Unfollow user
export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { userId } = req.params;

    await userModel.unfollowUser(req.user.userId, parseInt(userId));

    res.status(200).json({
      success: true,
      message: 'Takipten çıkıldı',
    });
  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({
      success: false,
      message: 'Takipten çıkılırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get user's followers
export const getFollowers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const followers = await userModel.getFollowers(parseInt(userId));

    res.status(200).json({
      success: true,
      data: followers,
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      success: false,
      message: 'Takipçiler alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get users that user is following
export const getFollowing = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const following = await userModel.getFollowing(parseInt(userId));

    res.status(200).json({
      success: true,
      data: following,
    });
  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      success: false,
      message: 'Takip edilenler alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
