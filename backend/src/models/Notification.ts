import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  message: string;
  leave: mongoose.Types.ObjectId;
  is_read: boolean;
  timestamp: Date;
}

const NotificationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  leave: { type: Schema.Types.ObjectId, ref: 'Leave' },
  is_read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>('Notification', NotificationSchema); 
