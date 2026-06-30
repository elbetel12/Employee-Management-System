import { Request, Response, NextFunction } from 'express';
/**
 * Wraps async route handlers so thrown errors are forwarded to errorHandler.
 */
export declare const asyncHandler: (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Builds a MongoDB pagination object from query parameters.
 */
export declare function getPagination(query: Record<string, unknown>): {
    page: number;
    limit: number;
    skip: number;
};
/**
 * Auto-derives performance rating from total monthly hours worked.
 * Mirror of Django's calculate_rating_based_on_hours().
 */
export declare function calcPerformanceRating(totalHours: number): 1 | 2 | 3 | 4 | 5;
/**
 * Payroll calculation engine — mirrors Django's generate_payroll logic.
 */
export interface PayrollCalcInput {
    baseSalary: number;
    totalHoursWorked: number;
    bonuses?: number;
}
export interface PayrollCalcResult {
    earnedSalary: number;
    deductions: number;
    taxes: number;
    netPay: number;
}
export declare function calcPayroll(input: PayrollCalcInput): PayrollCalcResult;
//# sourceMappingURL=index.d.ts.map