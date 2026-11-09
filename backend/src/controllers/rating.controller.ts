import { Request, Response } from 'express';
import * as ratingModel from '../models/rating.model';
import * as activityModel from '../models/activity.model';
import { ActivityType } from '../types';

// Create or update rating
export const createOrUpdateRating = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { content_id, rating } = req.body;

    if (!content_id || !rating) {
      res.status(400).json({
        success: false,
        message: 'İçerik ID ve puan gereklidir',
      });
      return;
    }

    if (rating < 1 || rating > 10) {
      res.status(400).json({
        success: false,
        message: 'Puan 1-10 arasında olmalıdır',
      });
      return;
    }

    const ratingData = await ratingModel.createOrUpdateRating(
      req.user.userId,
      content_id,
      rating
    );

    // Create activity for feed (only for new ratings, not updates)
    const existingRating = await ratingModel.getUserRatingForContent(
      req.user.userId,
      content_id
    );

    if (!existingRating) {
      try {
        await activityModel.createActivity(
          req.user.userId,
          ActivityType.RATING,
          content_id,
          { rating }
        );
      } catch (err) {
        console.error('Failed to create activity:', err);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Puanlama başarılı',
      data: ratingData,
    });
  } catch (error) {
    console.error('Create or update rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Puanlama sırasında bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get user's rating for a content
export const getUserRatingForContent = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { contentId } = req.params;

    const rating = await ratingModel.getUserRatingForContent(
      req.user.userId,
      parseInt(contentId)
    );

    res.status(200).json({
      success: true,
      data: rating,
    });
  } catch (error) {
    console.error('Get user rating for content error:', error);
    res.status(500).json({
      success: false,
      message: 'Puan alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get all ratings for a content
export const getRatingsForContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.params;

    const ratings = await ratingModel.getRatingsForContent(parseInt(contentId));
    const average = await ratingModel.getAverageRatingForContent(parseInt(contentId));

    res.status(200).json({
      success: true,
      data: {
        ratings,
        average_rating: parseFloat(average.average_rating).toFixed(1),
        rating_count: average.rating_count,
      },
    });
  } catch (error) {
    console.error('Get ratings for content error:', error);
    res.status(500).json({
      success: false,
      message: 'Puanlar alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get user's all ratings
export const getUserRatings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const ratings = await ratingModel.getRatingsByUser(parseInt(userId));

    res.status(200).json({
      success: true,
      data: ratings,
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı puanları alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete rating
export const deleteRating = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { id } = req.params;
    const ratingId = parseInt(id);

    // Check if rating exists and belongs to user
    const rating = await ratingModel.getRatingById(ratingId);

    if (!rating) {
      res.status(404).json({
        success: false,
        message: 'Puan bulunamadı',
      });
      return;
    }

    if (rating.user_id !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: 'Bu puanı silme yetkiniz yok',
      });
      return;
    }

    await ratingModel.deleteRating(ratingId);

    res.status(200).json({
      success: true,
      message: 'Puan başarıyla silindi',
    });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Puan silinirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default {
  createOrUpdateRating,
  getUserRatingForContent,
  getRatingsForContent,
  getUserRatings,
  deleteRating,
};
