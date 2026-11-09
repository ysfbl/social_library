import { Request, Response } from 'express';
import * as activityModel from '../models/activity.model';

// Get feed (activities from followed users)
export const getFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { page = 1, limit = 15 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const activities = await activityModel.getFeedActivities(req.user.userId, limitNum, offset);

    res.status(200).json({
      success: true,
      data: activities,
      page: pageNum,
      limit: limitNum,
      hasMore: activities.length === limitNum,
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({
      success: false,
      message: 'Akış alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get user's activities
export const getUserActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const activities = await activityModel.getUserActivities(
      parseInt(userId),
      limitNum,
      offset
    );

    res.status(200).json({
      success: true,
      data: activities,
      page: pageNum,
      limit: limitNum,
      hasMore: activities.length === limitNum,
    });
  } catch (error) {
    console.error('Get user activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı aktiviteleri alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default {
  getFeed,
  getUserActivities,
};
