import { Request, Response } from 'express';
import * as reviewModel from '../models/review.model';
import * as activityModel from '../models/activity.model';
import { ActivityType } from '../types';

// Create review
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { content_id, text } = req.body;

    if (!content_id || !text) {
      res.status(400).json({
        success: false,
        message: 'İçerik ID ve yorum metni gereklidir',
      });
      return;
    }

    if (text.trim().length < 10) {
      res.status(400).json({
        success: false,
        message: 'Yorum en az 10 karakter olmalıdır',
      });
      return;
    }

    const review = await reviewModel.createReview(req.user.userId, content_id, text);

    // Create activity for feed
    try {
      await activityModel.createActivity(req.user.userId, ActivityType.REVIEW, content_id, {
        review_excerpt: text.substring(0, 150),
      });
    } catch (err) {
      console.error('Failed to create activity:', err);
    }

    res.status(201).json({
      success: true,
      message: 'Yorum başarıyla oluşturuldu',
      data: review,
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Yorum oluşturulurken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get reviews for content
export const getReviewsForContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const reviews = await reviewModel.getReviewsForContent(
      parseInt(contentId),
      limitNum,
      offset
    );
    const totalCount = await reviewModel.getReviewCountForContent(parseInt(contentId));

    // If user is authenticated, check which reviews they've liked
    if (req.user) {
      for (const review of reviews) {
        review.is_liked_by_user = await reviewModel.hasUserLikedReview(
          req.user.userId,
          review.id
        );
      }
    }

    res.status(200).json({
      success: true,
      data: reviews,
      page: pageNum,
      limit: limitNum,
      total: totalCount,
      hasMore: offset + reviews.length < totalCount,
    });
  } catch (error) {
    console.error('Get reviews for content error:', error);
    res.status(500).json({
      success: false,
      message: 'Yorumlar alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get user's reviews
export const getUserReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const reviews = await reviewModel.getReviewsByUser(parseInt(userId), limitNum, offset);

    res.status(200).json({
      success: true,
      data: reviews,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Kullanıcı yorumları alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update review
export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      res.status(400).json({
        success: false,
        message: 'Yorum metni gereklidir',
      });
      return;
    }

    if (text.trim().length < 10) {
      res.status(400).json({
        success: false,
        message: 'Yorum en az 10 karakter olmalıdır',
      });
      return;
    }

    // Check if review exists and belongs to user
    const existingReview = await reviewModel.getReviewById(parseInt(id));

    if (!existingReview) {
      res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı',
      });
      return;
    }

    if (existingReview.user_id !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: 'Bu yorumu düzenleme yetkiniz yok',
      });
      return;
    }

    const updatedReview = await reviewModel.updateReview(parseInt(id), text);

    res.status(200).json({
      success: true,
      message: 'Yorum başarıyla güncellendi',
      data: updatedReview,
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Yorum güncellenirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete review
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { id } = req.params;

    // Check if review exists and belongs to user
    const review = await reviewModel.getReviewById(parseInt(id));

    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı',
      });
      return;
    }

    if (review.user_id !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: 'Bu yorumu silme yetkiniz yok',
      });
      return;
    }

    await reviewModel.deleteReview(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Yorum başarıyla silindi',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Yorum silinirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Like a review
export const likeReview = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { id } = req.params;

    // Check if review exists
    const review = await reviewModel.getReviewById(parseInt(id));

    if (!review) {
      res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı',
      });
      return;
    }

    await reviewModel.likeReview(req.user.userId, parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Yorum beğenildi',
    });
  } catch (error) {
    console.error('Like review error:', error);
    res.status(500).json({
      success: false,
      message: 'Yorum beğenilirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Unlike a review
export const unlikeReview = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { id } = req.params;

    await reviewModel.unlikeReview(req.user.userId, parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Beğeni geri alındı',
    });
  } catch (error) {
    console.error('Unlike review error:', error);
    res.status(500).json({
      success: false,
      message: 'Beğeni geri alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default {
  createReview,
  getReviewsForContent,
  getUserReviews,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
};
