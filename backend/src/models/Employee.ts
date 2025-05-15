import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  user: mongoose.Types.ObjectId;
  first_name: string;
  last_name: string;
  dob: Date;
  gender: string;
  address: string;
  phone: string;
  email: string;
  position: string;
  department: mongoose.Types.ObjectId;
  hire_date: Date;
  salary: number;
  is_department_head: boolean;
  image: string;
  is_active: boolean;
  qr_code_image: string;
}

const EmployeeSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  hire_date: { type: Date, required: true },
  salary: { type: Number, required: true },
  is_department_head: { type: Boolean, default: false },
  image: { type: String },
  is_active: { type: Boolean, default: true },
  qr_code_image: { type: String }
});

EmployeeSchema.post('save', async function(doc) {
  if (doc.is_department_head) {
    await mongoose.model('Department').findByIdAndUpdate(
      doc.department,
      { department_head: doc._id }
    );
  }
});

export default mongoose.model<IEmployee>('Employee', EmployeeSchema); 
