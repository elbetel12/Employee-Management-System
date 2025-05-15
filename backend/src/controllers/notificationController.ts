import { Request, Response } from 'express';
import Notification from '../models/Notification';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate('leave')
      .sort({ timestamp: -1 });
    
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get unread user notifications
// @route   GET /api/notifications/unread
// @access  Private
export const getUnreadNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ 
      user: req.user._id,
      is_read: false
    })
      .populate('leave')
      .sort({ timestamp: -1 });
    
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Ensure the notification belongs to the user
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    notification.is_read = true;
    const updatedNotification = await notification.save();
    
    res.json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, is_read: false },
      { $set: { is_read: true } }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Ensure the notification belongs to the user
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await notification.deleteOne();
    res.json({ message: 'Notification removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 