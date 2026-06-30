import { IPayroll } from './payroll.model';
import { GeneratePayrollInput, UpdatePayrollInput, PayrollQuery } from './payroll.schema';
import { PaginatedResponse } from '../../shared/types';
export declare function listPayrolls(query: PayrollQuery, departmentFilter?: string): Promise<PaginatedResponse<IPayroll>>;
export declare function generatePayroll(input: GeneratePayrollInput): Promise<{
    created: number;
    skipped: number;
}>;
export declare function updatePayroll(id: string, input: UpdatePayrollInput): Promise<IPayroll>;
export declare function getPayrollById(id: string): Promise<IPayroll>;
//# sourceMappingURL=payroll.service.d.ts.map