import mongoose, { Document } from 'mongoose';
export interface IDepartment extends Document {
    name: string;
    description: string;
    head?: mongoose.Types.ObjectId;
    isActive: boolean;
}
declare const _default: mongoose.Model<IDepartment, {}, {}, {}, mongoose.Document<unknown, {}, IDepartment, {}, {}> & IDepartment & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=department.model.d.ts.map