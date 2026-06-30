import mongoose, { Document, Schema } from 'mongoose';
import { LeaveStatus, LeaveType } from '../../shared/types';

export interface ILeave extends Document {
  employee: mongoose.Types.ObjectId;
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  status: LeaveStatus;
  document?: string;
  reason?: string;
}

const LeaveSchema = new Schema<ILeave>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },
    leaveType: {
      type: String,
      enum: [
        'Sick', 'Vacation', 'Maternity', 'Paternity',
        'Unpaid', 'Annual', 'Casual', 'Education',
      ] satisfies LeaveType[],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'] satisfies LeaveStatus[],
      default: 'Pending',
      index: true,
    },
    document: { type: String, default: null },
    reason: { type: String, trim: true, default: null },
  },
  { timestamps: true },
);

// Index for the "3 leaves per year" business rule query
LeaveSchema.index({ employee: 1, startDate: 1 });

export default mongoose.model<ILeave>('Leave', LeaveSchema);
