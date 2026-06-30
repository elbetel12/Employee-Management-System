import mongoose, { Document } from 'mongoose';
import { PerformanceRating } from '../../shared/types';
export interface IPerformance extends Document {
    employee: mongoose.Types.ObjectId;
    rating: PerformanceRating;
    comments?: string;
    evaluatedBy: mongoose.Types.ObjectId;
    month: number;
    year: number;
}
declare const _default: mongoose.Model<IPerformance, {}, {}, {}, mongoose.Document<unknown, {}, IPerformance, {}, {}> & IPerformance & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=performance.model.d.ts.map