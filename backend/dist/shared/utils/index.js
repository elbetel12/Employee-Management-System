"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
exports.getPagination = getPagination;
exports.calcPerformanceRating = calcPerformanceRating;
exports.calcPayroll = calcPayroll;
/**
 * Wraps async route handlers so thrown errors are forwarded to errorHandler.
 */
const asyncHandler = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};
exports.asyncHandler = asyncHandler;
/**
 * Builds a MongoDB pagination object from query parameters.
 */
function getPagination(query) {
    const page = Math.max(1, parseInt(String(query.page ?? '1'), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? '10'), 10)));
    return { page, limit, skip: (page - 1) * limit };
}
/**
 * Auto-derives performance rating from total monthly hours worked.
 * Mirror of Django's calculate_rating_based_on_hours().
 */
function calcPerformanceRating(totalHours) {
    if (totalHours >= 160)
        return 5;
    if (totalHours >= 120)
        return 4;
    if (totalHours >= 80)
        return 3;
    if (totalHours >= 40)
        return 2;
    return 1;
}
function calcPayroll(input) {
    const { baseSalary, totalHoursWorked, bonuses = 0 } = input;
    const STANDARD_HOURS = 160;
    const DEDUCTION_PER_HOUR = 10;
    const TAX_RATE = 0.2;
    const hourlyRate = baseSalary / STANDARD_HOURS;
    const earnedSalary = totalHoursWorked * hourlyRate;
    const deductions = totalHoursWorked < STANDARD_HOURS
        ? (STANDARD_HOURS - totalHoursWorked) * DEDUCTION_PER_HOUR
        : 0;
    const taxableIncome = earnedSalary + bonuses - deductions;
    const taxes = Math.max(0, taxableIncome * TAX_RATE);
    const netPay = taxableIncome - taxes;
    return {
        earnedSalary: parseFloat(earnedSalary.toFixed(2)),
        deductions: parseFloat(deductions.toFixed(2)),
        taxes: parseFloat(taxes.toFixed(2)),
        netPay: parseFloat(netPay.toFixed(2)),
    };
}
//# sourceMappingURL=index.js.map