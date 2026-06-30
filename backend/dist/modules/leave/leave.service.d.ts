import { ILeave } from './leave.model';
import { CreateLeaveInput, UpdateLeaveInput, LeaveQuery } from './leave.schema';
import { PaginatedResponse } from '../../shared/types';
export declare function listLeaves(query: LeaveQuery, departmentFilter?: string): Promise<PaginatedResponse<ILeave>>;
export declare function createLeave(input: CreateLeaveInput, requestingUserId: string): Promise<ILeave>;
export declare function updateLeave(id: string, input: UpdateLeaveInput): Promise<ILeave>;
export declare function deleteLeave(id: string): Promise<void>;
//# sourceMappingURL=leave.service.d.ts.map