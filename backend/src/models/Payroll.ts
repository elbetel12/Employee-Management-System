import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
  employee: mongoose.Types.ObjectId;
  pay_date: Date;
  month: number;
  year: number;
  base_salary: number;
  bonuses: number;
  deductions: number;
  taxes: number;
  net_pay: number;
}

interface IPayrollDocument extends IPayroll, Document {
  // Add any instance methods here
}

const PayrollSchema: Schema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  pay_date: { type: Date, required: true },
  month: { type: Number },
  year: { type: Number },
  base_salary: { type: Number, required: true },
  bonuses: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  taxes: { type: Number, default: 0 },
  net_pay: { type: Number }
});

PayrollSchema.pre<IPayrollDocument>('save', async function(next) {
  if (!this.isModified('month') && !this.isModified('year')) {
    this.month = this.pay_date.getMonth() + 1;
    this.year = this.pay_date.getFullYear();
  }
  
  // Calculate net pay
  this.net_pay = this.base_salary + this.bonuses - this.deductions - this.taxes;
  next();
});

export default mongoose.model<IPayrollDocument>('Payroll', PayrollSchema); 
