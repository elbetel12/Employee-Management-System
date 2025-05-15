import mongoose, { Schema, Document } from 'mongoose';

export interface IPerformance extends Document {
  employee: mongoose.Types.ObjectId;
  date: Date;
  rating: number;
  comments: string;
  evaluated_by: mongoose.Types.ObjectId;
}

const PerformanceSchema: Schema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, default: Date.now },
  rating: { 
    type: Number, 
    enum: [1, 2, 3, 4, 5], 
    required: true 
  },
  comments: { type: String },
  evaluated_by: { type: Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model<IPerformance>('Performance', PerformanceSchema); 
