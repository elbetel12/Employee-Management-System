import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  department_name: string;
  department_head: mongoose.Types.ObjectId;
  description: string;
  is_active: boolean;
}

const DepartmentSchema: Schema = new Schema({
  department_name: { type: String, required: true },
  department_head: { type: Schema.Types.ObjectId, ref: 'Employee', default: null },
  description: { type: String },
  is_active: { type: Boolean, default: true }
});

export default mongoose.model<IDepartment>('Department', DepartmentSchema); 