import mongoose, { Schema, Document } from 'mongoose';

export interface ILeave extends Document {
  employee: mongoose.Types.ObjectId;
  leave_type: string;
  start_date: Date;
  end_date: Date;
  status: string;
  image: string;
}

const LeaveSchema: Schema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  leave_type: { 
    type: String, 
    enum: ['Sick', 'Vacation', 'Maternity', 'Paternity', 'Unpaid', 'Annual', 'Casual', 'Education'], 
    required: true 
  },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], 
    default: 'Pending' 
  },
  image: { type: String }
});

export default mongoose.model<ILeave>('Leave', LeaveSchema); 
