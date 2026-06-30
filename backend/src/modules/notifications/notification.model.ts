import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  message: string;
  leave?: mongoose.Types.ObjectId;
  isRead: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: { type: String, required: true, trim: true },
    leave: { type: Schema.Types.ObjectId, ref: 'Leave', default: null },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
