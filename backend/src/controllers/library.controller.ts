import { Request, Response } from 'express';
import * as libraryModel from '../models/library.model';
import * as activityModel from '../models/activity.model';
import { ListType, ActivityType } from '../types';

// Get user's all lists
export const getUserLists = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const lists = await libraryModel.getUserLists(parseInt(userId));

    res.status(200).json({
      success: true,
      data: lists,
    });
  } catch (error) {
    console.error('Get user lists error:', error);
    res.status(500).json({
      success: false,
      message: 'Listeler alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get list items by type
export const getListItemsByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, type } = req.params;

    const list = await libraryModel.getListByType(parseInt(userId), type as ListType);

    if (!list) {
      res.status(404).json({
        success: false,
        message: 'Liste bulunamadı',
      });
      return;
    }

    const items = await libraryModel.getListItems(list.id);

    res.status(200).json({
      success: true,
      data: {
        list,
        items,
      },
    });
  } catch (error) {
    console.error('Get list items by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Liste öğeleri alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Add content to library
export const addToLibrary = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { list_type, content_id } = req.body;

    if (!list_type || !content_id) {
      res.status(400).json({
        success: false,
        message: 'Liste tipi ve içerik ID gereklidir',
      });
      return;
    }

    // Get the list
    const list = await libraryModel.getListByType(req.user.userId, list_type as ListType);

    if (!list) {
      res.status(404).json({
        success: false,
        message: 'Liste bulunamadı',
      });
      return;
    }

    // Add item to list
    const item = await libraryModel.addItemToList(list.id, content_id);

    // Create activity for feed
    try {
      await activityModel.createActivity(req.user.userId, ActivityType.LIST_ADD, content_id, {
        list_type,
        list_name: list.name,
      });
    } catch (err) {
      console.error('Failed to create activity:', err);
    }

    res.status(200).json({
      success: true,
      message: 'İçerik kütüphaneye eklendi',
      data: item,
    });
  } catch (error) {
    console.error('Add to library error:', error);
    res.status(500).json({
      success: false,
      message: 'Kütüphaneye eklenirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Remove content from library
export const removeFromLibrary = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { list_type, content_id } = req.body;

    if (!list_type || !content_id) {
      res.status(400).json({
        success: false,
        message: 'Liste tipi ve içerik ID gereklidir',
      });
      return;
    }

    // Get the list
    const list = await libraryModel.getListByType(req.user.userId, list_type as ListType);

    if (!list) {
      res.status(404).json({
        success: false,
        message: 'Liste bulunamadı',
      });
      return;
    }

    // Remove item from list
    await libraryModel.removeItemFromList(list.id, content_id);

    res.status(200).json({
      success: true,
      message: 'İçerik kütüphaneden çıkarıldı',
    });
  } catch (error) {
    console.error('Remove from library error:', error);
    res.status(500).json({
      success: false,
      message: 'Kütüphaneden çıkarılırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Create custom list
export const createCustomList = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Liste adı gereklidir',
      });
      return;
    }

    const list = await libraryModel.createCustomList(req.user.userId, name, description);

    res.status(201).json({
      success: true,
      message: 'Özel liste oluşturuldu',
      data: list,
    });
  } catch (error) {
    console.error('Create custom list error:', error);
    res.status(500).json({
      success: false,
      message: 'Liste oluşturulurken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get user's custom lists
export const getUserCustomLists = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const lists = await libraryModel.getUserCustomLists(parseInt(userId));

    res.status(200).json({
      success: true,
      data: lists,
    });
  } catch (error) {
    console.error('Get user custom lists error:', error);
    res.status(500).json({
      success: false,
      message: 'Özel listeler alınırken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Update custom list
export const updateCustomList = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({
        success: false,
        message: 'Liste adı gereklidir',
      });
      return;
    }

    // Check if list exists and belongs to user
    const existingList = await libraryModel.getListById(parseInt(id));

    if (!existingList) {
      res.status(404).json({
        success: false,
        message: 'Liste bulunamadı',
      });
      return;
    }

    if (existingList.user_id !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: 'Bu listeyi düzenleme yetkiniz yok',
      });
      return;
    }

    const list = await libraryModel.updateCustomList(parseInt(id), name, description);

    res.status(200).json({
      success: true,
      message: 'Liste güncellendi',
      data: list,
    });
  } catch (error) {
    console.error('Update custom list error:', error);
    res.status(500).json({
      success: false,
      message: 'Liste güncellenirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Delete custom list
export const deleteCustomList = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { id } = req.params;

    // Check if list exists and belongs to user
    const list = await libraryModel.getListById(parseInt(id));

    if (!list) {
      res.status(404).json({
        success: false,
        message: 'Liste bulunamadı',
      });
      return;
    }

    if (list.user_id !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: 'Bu listeyi silme yetkiniz yok',
      });
      return;
    }

    await libraryModel.deleteCustomList(parseInt(id));

    res.status(200).json({
      success: true,
      message: 'Liste silindi',
    });
  } catch (error) {
    console.error('Delete custom list error:', error);
    res.status(500).json({
      success: false,
      message: 'Liste silinirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Add item to custom list
export const addItemToCustomList = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Kimlik doğrulama gerekli',
      });
      return;
    }

    const { listId } = req.params;
    const { content_id } = req.body;

    if (!content_id) {
      res.status(400).json({
        success: false,
        message: 'İçerik ID gereklidir',
      });
      return;
    }

    // Check if list exists and belongs to user
    const list = await libraryModel.getListById(parseInt(listId));

    if (!list) {
      res.status(404).json({
        success: false,
        message: 'Liste bulunamadı',
      });
      return;
    }

    if (list.user_id !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: 'Bu listeye ekleme yetkiniz yok',
      });
      return;
    }

    const item = await libraryModel.addItemToList(parseInt(listId), content_id);

    res.status(200).json({
      success: true,
      message: 'İçerik listeye eklendi',
      data: item,
    });
  } catch (error) {
    console.error('Add item to custom list error:', error);
    res.status(500).json({
      success: false,
      message: 'Listeye eklenirken bir hata oluştu',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default {
  getUserLists,
  getListItemsByType,
  addToLibrary,
  removeFromLibrary,
  createCustomList,
  getUserCustomLists,
  updateCustomList,
  deleteCustomList,
  addItemToCustomList,
};
