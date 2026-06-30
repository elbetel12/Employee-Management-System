import { IAttendance } from './attendance.model';
import { ManualAttendanceInput, UpdateAttendanceInput, AttendanceQuery } from './attendance.schema';
import { PaginatedResponse } from '../../shared/types';
export declare function listAttendance(query: AttendanceQuery, departmentFilter?: string): Promise<PaginatedResponse<IAttendance>>;
/**
 * QR-based check-in / check-out.
 * First scan = check-in, second scan = check-out.
 */
export declare function processQrScan(email: string): Promise<string>;
export declare function createManualAttendance(input: ManualAttendanceInput): Promise<IAttendance>;
export declare function updateAttendance(id: string, input: UpdateAttendanceInput): Promise<IAttendance>;
/** Returns total hours worked in a given month/year for payroll & performance. */
export declare function calcTotalHours(employeeId: string, month: number, year: number): Promise<number>;
//# sourceMappingURL=attendance.service.d.ts.map