import { IPerformance } from './performance.model';
import { EvaluateInput, PerformanceQuery } from './performance.schema';
import { PaginatedResponse } from '../../shared/types';
export declare function listPerformances(query: PerformanceQuery, departmentFilter?: string): Promise<PaginatedResponse<IPerformance>>;
export declare function evaluateEmployee(employeeId: string, evaluatorUserId: string, input: EvaluateInput): Promise<IPerformance>;
//# sourceMappingURL=performance.service.d.ts.map