import mongoose from 'mongoose';
import Attendance, { IAttendance } from './attendance.model';
import Employee from '../employees/employee.model';
import { AppError } from '../../middleware/errorHandler';
import { getPagination } from '../../shared/utils';
import {
  ManualAttendanceInput,
  UpdateAttendanceInput,
  AttendanceQuery,
} from './attendance.schema';
import { PaginatedResponse } from '../../shared/types';

export async function listAttendance(
  query: AttendanceQuery,
  departmentFilter?: string,
): Promise<PaginatedResponse<IAttendance>> {
  const { page, limit, skip } = getPagination(query);
  const filter: mongoose.FilterQuery<IAttendance> = {};

  if (query.employeeId) filter.employee = query.employeeId;

  if (departmentFilter) {
    const empIds = await Employee.find({ department: departmentFilter, isActive: true })
      .distinct('_id');
    filter.employee = { $in: empIds };
  }

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }

  const [data, total] = await Promise.all([
    Attendance.find(filter)
      .populate('employee', 'firstName lastName department')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Attendance.countDocuments(filter),
  ]);

  return {
    success: true,
    data: data as unknown as IAttendance[],
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

/**
 * QR-based check-in / check-out.
 * First scan = check-in, second scan = check-out.
 */
export async function processQrScan(email: string): Promise<string> {
  const employee = await Employee.findOne({ email, isActive: true });
  if (!employee) throw new AppError('Employee not found.', 404);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await Attendance.findOne({ employee: employee._id, date: today });

  if (!existing) {
    await Attendance.create({
      employee: employee._id,
      date: today,
      checkIn: new Date(),
    });
    return 'Checked in successfully.';
  }

  if (!existing.checkOut) {
    existing.checkOut = new Date();
    await existing.save();
    return 'Checked out successfully.';
  }

  throw new AppError('Already checked in and out for today.', 400);
}

export async function createManualAttendance(
  input: ManualAttendanceInput,
): Promise<IAttendance> {
  const employee = await Employee.findById(input.employeeId);
  if (!employee) throw new AppError('Employee not found.', 404);

  const date = input.date ? new Date(input.date) : new Date();
  date.setHours(0, 0, 0, 0);

  const record = await Attendance.findOneAndUpdate(
    { employee: input.employeeId, date },
    {
      ...(input.checkIn && { checkIn: new Date(input.checkIn) }),
      ...(input.checkOut && { checkOut: new Date(input.checkOut) }),
    },
    { upsert: true, new: true, runValidators: true },
  );

  return record;
}

export async function updateAttendance(
  id: string,
  input: UpdateAttendanceInput,
): Promise<IAttendance> {
  const record = await Attendance.findByIdAndUpdate(
    id,
    {
      ...(input.checkIn && { checkIn: new Date(input.checkIn) }),
      ...(input.checkOut && { checkOut: new Date(input.checkOut) }),
    },
    { new: true, runValidators: true },
  );
  if (!record) throw new AppError('Attendance record not found.', 404);
  return record;
}

/** Returns total hours worked in a given month/year for payroll & performance. */
export async function calcTotalHours(
  employeeId: string,
  month: number,
  year: number,
): Promise<number> {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const records = await Attendance.find({
    employee: employeeId,
    date: { $gte: start, $lte: end },
    checkIn: { $ne: null },
    checkOut: { $ne: null },
  }).lean();

  const totalMs = records.reduce((sum, r) => {
    const ms =
      new Date(r.checkOut!).getTime() - new Date(r.checkIn!).getTime();
    return sum + (ms > 0 ? ms : 0);
  }, 0);

  return parseFloat((totalMs / 3_600_000).toFixed(2));
}
