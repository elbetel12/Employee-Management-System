import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  employee: mongoose.Types.ObjectId;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },
    date: { type: Date, required: true },
    checkIn: { type: Date, default: null },
    checkOut: { type: Date, default: null },
  },
  { timestamps: true },
);

// One record per employee per day
AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

// Fast monthly queries for payroll/reports
AttendanceSchema.index({ date: 1 });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
