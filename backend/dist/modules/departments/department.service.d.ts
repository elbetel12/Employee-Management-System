import { IDepartment } from './department.model';
import { CreateDepartmentInput, UpdateDepartmentInput, DepartmentQuery } from './department.schema';
import { PaginatedResponse } from '../../shared/types';
export declare function listDepartments(query: DepartmentQuery): Promise<PaginatedResponse<IDepartment>>;
export declare function getDepartmentById(id: string): Promise<IDepartment>;
export declare function createDepartment(input: CreateDepartmentInput): Promise<IDepartment>;
export declare function updateDepartment(id: string, input: UpdateDepartmentInput): Promise<IDepartment>;
export declare function softDeleteDepartment(id: string): Promise<void>;
//# sourceMappingURL=department.service.d.ts.map