import { IEmployee } from './employee.model';
import { PaginatedResponse } from '../../shared/types';
import { CreateEmployeeInput, UpdateEmployeeInput, EmployeeQuery } from './employee.schema';
export declare function listEmployees(query: EmployeeQuery, departmentFilter?: string): Promise<PaginatedResponse<IEmployee>>;
export declare function getEmployeeById(id: string): Promise<IEmployee>;
export declare function createEmployee(input: CreateEmployeeInput): Promise<IEmployee>;
export declare function updateEmployee(id: string, input: UpdateEmployeeInput): Promise<IEmployee>;
export declare function softDeleteEmployee(id: string): Promise<void>;
//# sourceMappingURL=employee.service.d.ts.map