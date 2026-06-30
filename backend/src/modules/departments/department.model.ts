import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  description: string;
  head?: mongoose.Types.ObjectId;
  isActive: boolean;
}

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    head: { type: Schema.Types.ObjectId, ref: 'Employee', default: null },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export default mongoose.model<IDepartment>('Department', DepartmentSchema);
