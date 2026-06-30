import mongoose, { Document, Schema } from 'mongoose';
import { PerformanceRating } from '../../shared/types';

export interface IPerformance extends Document {
  employee: mongoose.Types.ObjectId;
  rating: PerformanceRating;
  comments?: string;
  evaluatedBy: mongoose.Types.ObjectId;
  month: number;
  year: number;
}

const PerformanceSchema = new Schema<IPerformance>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },
    rating: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    comments: { type: String, trim: true, default: null },
    evaluatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
  },
  { timestamps: true },
);

// One evaluation per employee per month — mirrors Django's monthly check
PerformanceSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<IPerformance>('Performance', PerformanceSchema);
