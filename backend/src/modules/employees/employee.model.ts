import mongoose, { Document, Schema } from 'mongoose';
import { Gender } from '../../shared/types';

export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  dob: Date;
  gender: Gender;
  address: string;
  phone: string;
  email: string;
  position: string;
  department: mongoose.Types.ObjectId;
  hireDate: Date;
  salary: number;
  isDepartmentHead: boolean;
  avatar?: string;
  qrCode?: string;
  isActive: boolean;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female'] satisfies Gender[], required: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    position: { type: String, required: true, trim: true },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
      index: true,
    },
    hireDate: { type: Date, required: true },
    salary: { type: Number, required: true, min: 0 },
    isDepartmentHead: { type: Boolean, default: false },
    avatar: { type: String, default: null },
    qrCode: { type: String, default: null },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound index for full-name search
EmployeeSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

// Virtual: full name
EmployeeSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
