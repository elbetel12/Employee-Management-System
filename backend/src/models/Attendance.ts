import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  employee: mongoose.Types.ObjectId;
  date: Date;
  check_in: Date;
  check_out: Date;
}

const AttendanceSchema: Schema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, default: Date.now },
  check_in: { type: Date },
  check_out: { type: Date }
});

// Create a compound index to ensure uniqueness for employee and date
AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema); 
