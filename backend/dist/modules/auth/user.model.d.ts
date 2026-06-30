import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=user.model.d.ts.map