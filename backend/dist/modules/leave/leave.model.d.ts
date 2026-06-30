import mongoose, { Document } from 'mongoose';
import { LeaveStatus, LeaveType } from '../../shared/types';
export interface ILeave extends Document {
    employee: mongoose.Types.ObjectId;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    status: LeaveStatus;
    document?: string;
    reason?: string;
}
declare const _default: mongoose.Model<ILeave, {}, {}, {}, mongoose.Document<unknown, {}, ILeave, {}, {}> & ILeave & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=leave.model.d.ts.map