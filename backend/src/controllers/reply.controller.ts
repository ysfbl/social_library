import { Request, Response } from 'express';
import * as replyModel from '../models/reply.model';

// Create reply
export const createReply = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { reviewId } = req.params;
    const { text } = req.body;

    if (!text) {
      res.status(400).json({
        success: false,
        message: 'Yanıt metni gereklidir',
      });
      return;
    }

    if (text.trim().length < 1) {
      res.status(400).json({
        success: false,
        message: 'Yanıt en az 1 karakter olmalıdır',
      });
      return;
    }

    const reply = await replyModel.createReply(req.user.userId, parseInt(reviewId), text);

    res.status(201).json({
      success: true,
      message: 'Yanıt başarıyla oluşturuldu',
      data: reply,
    });
  } catch (error) {
    console.error('Create reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Yanıt oluşturulurken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get replies for a review
export const getRepliesForReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;

    const replies = await replyModel.getRepliesForReview(parseInt(reviewId));

    // If user is authenticated, check which replies they've liked
    if (req.user) {
      for (const reply of replies) {
        reply.is_liked_by_user = await replyModel.hasUserLikedReply(
          req.user.userId,
          reply.id
        );
      }
    }

    res.status(200).json({
      success: true,
      data: replies,
    });
  } catch (error) {
    console.error('Get replies for review error:', error);
    res.status(500).json({
      success: false,
      message: 'Yanıtlar alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update reply
export const updateReply = async (req: Request, res: Response): Promise<void> => {
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
        message: 'Yanıt metni gereklidir',
      });
      return;
    }

    if (text.trim().length < 1) {
      res.status(400).json({
        success: false,
        message: 'Yanıt en az 1 karakter olmalıdır',
      });
      return;
    }

    // Check if reply exists and belongs to user
    const existingReply = await replyModel.getReplyById(parseInt(id));

    if (!existingReply) {
      res.status(404).json({
        success: false,
        message: 'Yanıt bulunamadı',
      });
      return;
    }

    if (existingReply.user_id !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: 'Bu yanıtı düzenleme yetkiniz yok',
      });
      return;
    }

    const updatedReply = await replyModel.updateReply(parseInt(id), text);

    res.status(200).json({
      success: true,
      message: 'Yanıt başarıyla güncellendi',
      data: updatedReply,
    });
  } catch (error) {
    console.error('Update reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Yanıt güncellenirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete reply
export const deleteReply = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { id } = req.params;

    // Check if reply exists and belongs to user
    const reply = await replyModel.getReplyById(parseInt(id));

    if (!reply) {
      res.status(404).json({
        success: false,
        message: 'Yanıt bulunamadı',
      });
      return;
    }

    if (reply.user_id !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: 'Bu yanıtı silme yetkiniz yok',
      });
      return;
    }

    await replyModel.deleteReply(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Yanıt başarıyla silindi',
    });
  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Yanıt silinirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Like a reply
export const likeReply = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { id } = req.params;

    // Check if reply exists
    const reply = await replyModel.getReplyById(parseInt(id));

    if (!reply) {
      res.status(404).json({
        success: false,
        message: 'Yanıt bulunamadı',
      });
      return;
    }

    await replyModel.likeReply(req.user.userId, parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Yanıt beğenildi',
    });
  } catch (error) {
    console.error('Like reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Yanıt beğenilirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Unlike a reply
export const unlikeReply = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { id } = req.params;

    await replyModel.unlikeReply(req.user.userId, parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Beğeni geri alındı',
    });
  } catch (error) {
    console.error('Unlike reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Beğeni geri alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default {
  createReply,
  getRepliesForReview,
  updateReply,
  deleteReply,
  likeReply,
  unlikeReply,
};
