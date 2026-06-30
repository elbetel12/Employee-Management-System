import mongoose, { Document, Schema } from 'mongoose';

export interface IPayroll extends Document {
  employee: mongoose.Types.ObjectId;
  payDate: Date;
  month: number;
  year: number;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  taxes: number;
  netPay: number;
}

const PayrollSchema = new Schema<IPayroll>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },
    payDate: { type: Date, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    baseSalary: { type: Number, required: true, min: 0 },
    bonuses: { type: Number, default: 0, min: 0 },
    deductions: { type: Number, default: 0, min: 0 },
    taxes: { type: Number, default: 0, min: 0 },
    netPay: { type: Number, required: true },
  },
  { timestamps: true },
);

// Enforce one payroll per employee per month/year
PayrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<IPayroll>('Payroll', PayrollSchema);
