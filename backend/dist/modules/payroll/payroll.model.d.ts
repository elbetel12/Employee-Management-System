import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IPayroll, {}, {}, {}, mongoose.Document<unknown, {}, IPayroll, {}, {}> & IPayroll & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=payroll.model.d.ts.map