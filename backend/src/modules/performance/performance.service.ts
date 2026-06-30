import mongoose from 'mongoose';
import Performance, { IPerformance } from './performance.model';
import Employee from '../employees/employee.model';
import Notification from '../notifications/notification.model';
import User from '../auth/user.model';
import { AppError } from '../../middleware/errorHandler';
import { getPagination, calcPerformanceRating } from '../../shared/utils';
import { calcTotalHours } from '../attendance/attendance.service';
import { EvaluateInput, PerformanceQuery } from './performance.schema';
import { PaginatedResponse } from '../../shared/types';

export async function listPerformances(
  query: PerformanceQuery,
  departmentFilter?: string,
): Promise<PaginatedResponse<IPerformance>> {
  const { page, limit, skip } = getPagination(query);
  const filter: mongoose.FilterQuery<IPerformance> = {};

  if (query.employeeId) filter.employee = query.employeeId;
  if (query.month) filter.month = query.month;
  if (query.year) filter.year = query.year;

  if (departmentFilter) {
    const empIds = await Employee.find({ department: departmentFilter }).distinct('_id');
    filter.employee = { $in: empIds };
  }

  if (query.search) {
    const empIds = await Employee.find({
      $or: [
        { firstName: new RegExp(query.search, 'i') },
        { lastName: new RegExp(query.search, 'i') },
      ],
    }).distinct('_id');
    filter.employee = { $in: empIds };
  }

  const [data, total] = await Promise.all([
    Performance.find(filter)
      .populate('employee', 'firstName lastName department position')
      .populate('evaluatedBy', 'email role')
      .sort({ year: -1, month: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Performance.countDocuments(filter),
  ]);

  return {
    success: true,
    data: data as unknown as IPerformance[],
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function evaluateEmployee(
  employeeId: string,
  evaluatorUserId: string,
  input: EvaluateInput,
): Promise<IPerformance> {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // One evaluation per month per employee
  const exists = await Performance.findOne({ employee: employeeId, month, year });
  if (exists) {
    throw new AppError(
      'This employee has already been evaluated for this month.',
      409,
    );
  }

  const totalHours = await calcTotalHours(employeeId, month, year);

  if (totalHours === 0) {
    const emp = await Employee.findById(employeeId);
    const empUser = await User.findOne({ employee: employeeId }).select('_id');
    if (empUser && emp) {
      await Notification.create({
        user: empUser._id,
        message: `No performance evaluation for ${emp.firstName} ${emp.lastName} this month — no hours worked.`,
      });
    }
    throw new AppError('Cannot evaluate: employee worked 0 hours this month.', 400);
  }

  const rating = calcPerformanceRating(totalHours);

  const perf = await Performance.create({
    employee: employeeId,
    rating,
    comments: input.comments,
    evaluatedBy: evaluatorUserId,
    month,
    year,
  });

  const empUser = await User.findOne({ employee: employeeId, isActive: true }).select('_id');
  if (empUser) {
    const monthName = new Date(0, month - 1).toLocaleString('en-US', { month: 'long' });
    await Notification.create({
      user: empUser._id,
      message: `Your performance for ${monthName} ${year} has been evaluated. Rating: ${rating}/5.`,
    });
  }

  return perf;
}
