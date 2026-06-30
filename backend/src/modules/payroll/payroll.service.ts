import Employee from '../employees/employee.model';
import Payroll, { IPayroll } from './payroll.model';
import Notification from '../notifications/notification.model';
import User from '../auth/user.model';
import { AppError } from '../../middleware/errorHandler';
import { getPagination, calcPayroll } from '../../shared/utils';
import { calcTotalHours } from '../attendance/attendance.service';
import {
  GeneratePayrollInput,
  UpdatePayrollInput,
  PayrollQuery,
} from './payroll.schema';
import { PaginatedResponse } from '../../shared/types';
import mongoose from 'mongoose';

export async function listPayrolls(
  query: PayrollQuery,
  departmentFilter?: string,
): Promise<PaginatedResponse<IPayroll>> {
  const { page, limit, skip } = getPagination(query);
  const filter: mongoose.FilterQuery<IPayroll> = {};

  if (query.employeeId) filter.employee = query.employeeId;
  if (query.month) filter.month = query.month;
  if (query.year) filter.year = query.year;

  if (departmentFilter) {
    const empIds = await Employee.find({ department: departmentFilter }).distinct('_id');
    filter.employee = { $in: empIds };
  }

  const [data, total] = await Promise.all([
    Payroll.find(filter)
      .populate('employee', 'firstName lastName department position')
      .sort({ year: -1, month: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Payroll.countDocuments(filter),
  ]);

  return {
    success: true,
    data: data as unknown as IPayroll[],
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function generatePayroll(
  input: GeneratePayrollInput,
): Promise<{ created: number; skipped: number }> {
  const payDate = new Date(input.payDate);
  const month = payDate.getMonth() + 1;
  const year = payDate.getFullYear();

  const employees = await Employee.find({ isActive: true });
  let created = 0;
  let skipped = 0;

  for (const emp of employees) {
    const already = await Payroll.findOne({ employee: emp._id, month, year });
    if (already) { skipped++; continue; }

    const totalHours = await calcTotalHours(emp._id.toString(), month, year);

    if (totalHours === 0) {
      // No-work notification
      const empUser = await User.findOne({ employee: emp._id }).select('_id');
      if (empUser) {
        await Notification.create({
          user: empUser._id,
          message: `No payroll generated for ${month}/${year} due to zero hours worked.`,
        });
      }
      skipped++;
      continue;
    }

    const { earnedSalary, deductions, taxes, netPay } = calcPayroll({
      baseSalary: emp.salary,
      totalHoursWorked: totalHours,
    });

    const payroll = await Payroll.create({
      employee: emp._id,
      payDate,
      month,
      year,
      baseSalary: earnedSalary,
      bonuses: 0,
      deductions,
      taxes,
      netPay,
    });

    // Notify employee
    const empUser = await User.findOne({ employee: emp._id }).select('_id');
    if (empUser) {
      await Notification.create({
        user: empUser._id,
        message: `Your payroll for ${month}/${year} has been generated. Net pay: ${netPay.toFixed(2)}.`,
      });
    }

    created++;
  }

  return { created, skipped };
}

export async function updatePayroll(
  id: string,
  input: UpdatePayrollInput,
): Promise<IPayroll> {
  const payroll = await Payroll.findById(id);
  if (!payroll) throw new AppError('Payroll record not found.', 404);

  Object.assign(payroll, input);
  // Recalculate net pay if any component changed
  payroll.netPay =
    payroll.baseSalary + payroll.bonuses - payroll.deductions - payroll.taxes;
  await payroll.save();

  return payroll;
}

export async function getPayrollById(id: string): Promise<IPayroll> {
  const payroll = await Payroll.findById(id)
    .populate('employee', 'firstName lastName position department email salary');
  if (!payroll) throw new AppError('Payroll not found.', 404);
  return payroll;
}
