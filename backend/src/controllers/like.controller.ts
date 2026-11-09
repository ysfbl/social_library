import { Request, Response } from 'express';
import * as likeModel from '../models/like.model';

// Toggle like on an activity
export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { activityId } = req.params;

    if (!activityId) {
      res.status(400).json({
        success: false,
        message: 'Aktivite ID gereklidir',
      });
      return;
    }

    const result = await likeModel.toggleLike(req.user.userId, parseInt(activityId));
    const likeCount = await likeModel.getLikeCount(parseInt(activityId));

    res.status(200).json({
      success: true,
      data: {
        liked: result.liked,
        likeCount,
      },
      message: result.liked ? 'Beğenildi' : 'Beğeni kaldırıldı',
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Beğeni işlemi başarısız oldu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get like count for an activity
export const getLikeCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { activityId } = req.params;

    if (!activityId) {
      res.status(400).json({
        success: false,
        message: 'Aktivite ID gereklidir',
      });
      return;
    }

    const likeCount = await likeModel.getLikeCount(parseInt(activityId));
    const userLiked = req.user
      ? await likeModel.hasUserLiked(req.user.userId, parseInt(activityId))
      : false;

    res.status(200).json({
      success: true,
      data: {
        likeCount,
        userLiked,
      },
    });
  } catch (error) {
    console.error('Get like count error:', error);
    res.status(500).json({
      success: false,
      message: 'Beğeni sayısı alınamadı',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default {
  toggleLike,
  getLikeCount,
};
