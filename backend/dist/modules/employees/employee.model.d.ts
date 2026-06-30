import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IEmployee, {}, {}, {}, mongoose.Document<unknown, {}, IEmployee, {}, {}> & IEmployee & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=employee.model.d.ts.map