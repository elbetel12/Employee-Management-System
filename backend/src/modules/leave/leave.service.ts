import mongoose from 'mongoose';
import Leave, { ILeave } from './leave.model';
import Employee from '../employees/employee.model';
import Department from '../departments/department.model';
import Notification from '../notifications/notification.model';
import User from '../auth/user.model';
import { AppError } from '../../middleware/errorHandler';
import { getPagination } from '../../shared/utils';
import { CreateLeaveInput, UpdateLeaveInput, LeaveQuery } from './leave.schema';
import { PaginatedResponse } from '../../shared/types';

export async function listLeaves(
  query: LeaveQuery,
  departmentFilter?: string,
): Promise<PaginatedResponse<ILeave>> {
  const { page, limit, skip } = getPagination(query);
  const filter: mongoose.FilterQuery<ILeave> = {};

  if (query.status) filter.status = query.status;
  if (query.employeeId) filter.employee = query.employeeId;

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
    Leave.find(filter)
      .populate('employee', 'firstName lastName email department')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Leave.countDocuments(filter),
  ]);

  return {
    success: true,
    data: data as unknown as ILeave[],
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function createLeave(
  input: CreateLeaveInput,
  requestingUserId: string,
): Promise<ILeave> {
  const employee = await Employee.findById(input.employeeId);
  if (!employee) throw new AppError('Employee not found.', 404);

  // 1-year tenure gate
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  if (employee.hireDate > oneYearAgo) {
    throw new AppError(
      'Employees must have been employed for at least 1 year to apply for leave.',
      400,
    );
  }

  // Max 3 leaves per calendar year
  const currentYear = new Date().getFullYear();
  const leaveCount = await Leave.countDocuments({
    employee: input.employeeId,
    startDate: {
      $gte: new Date(currentYear, 0, 1),
      $lte: new Date(currentYear, 11, 31),
    },
  });
  if (leaveCount >= 3) {
    throw new AppError('Employees may apply for leave only 3 times per year.', 400);
  }

  // Duplicate check
  const duplicate = await Leave.findOne({
    employee: input.employeeId,
    leaveType: input.leaveType,
    startDate: new Date(input.startDate),
  });
  if (duplicate) {
    throw new AppError('A leave with the same type and start date already exists.', 409);
  }

  const leave = await Leave.create({
    employee: input.employeeId,
    leaveType: input.leaveType,
    startDate: new Date(input.startDate),
    endDate: new Date(input.endDate),
    reason: input.reason,
  });

  // Notify department head if applicable
  const dept = await Department.findById(employee.department);
  if (dept && dept.head) {
    const headUser = await User.findOne({ employee: dept.head, isActive: true }).select('_id');
    if (headUser) {
      await Notification.create({
        user: headUser._id,
        message: `${employee.firstName} ${employee.lastName} requested ${input.leaveType} leave from ${input.startDate} to ${input.endDate}.`,
        leave: leave._id,
      });
    }
  }

  // Notify all admin users
  const admins = await User.find({ role: 'admin', isActive: true }).select('_id');
  await Notification.insertMany(
    admins.map((admin) => ({
      user: admin._id,
      message: `${employee.firstName} ${employee.lastName} applied for ${input.leaveType} leave from ${input.startDate} to ${input.endDate}.`,
      leave: leave._id,
    })),
  );

  return leave;
}

export async function updateLeave(
  id: string,
  input: UpdateLeaveInput,
): Promise<ILeave> {
  const leave = await Leave.findById(id).populate('employee');
  if (!leave) throw new AppError('Leave not found.', 404);

  const previousStatus = leave.status;

  Object.assign(leave, {
    ...(input.leaveType && { leaveType: input.leaveType }),
    ...(input.startDate && { startDate: new Date(input.startDate) }),
    ...(input.endDate && { endDate: new Date(input.endDate) }),
    ...(input.status && { status: input.status }),
    ...(input.reason && { reason: input.reason }),
  });

  await leave.save();

  // Notify the employee when status changes
  if (input.status && input.status !== previousStatus) {
    const empUser = await User.findOne({ employee: leave.employee }).select('_id');
    if (empUser) {
      await Notification.create({
        user: empUser._id,
        message: `Your ${leave.leaveType} leave request from ${leave.startDate.toDateString()} to ${leave.endDate.toDateString()} has been ${leave.status}.`,
        leave: leave._id,
      });
    }
  }

  return leave;
}

export async function deleteLeave(id: string): Promise<void> {
  const leave = await Leave.findByIdAndDelete(id);
  if (!leave) throw new AppError('Leave not found.', 404);
}
