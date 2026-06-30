import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../../shared/types';

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  employee?: mongoose.Types.ObjectId;
  refreshToken?: string;
  isActive: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['admin', 'manager', 'employee'] satisfies UserRole[],
      default: 'employee',
    },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', default: null },
    refreshToken: { type: String, select: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function (
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
