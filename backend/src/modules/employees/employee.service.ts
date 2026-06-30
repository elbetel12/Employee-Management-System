import mongoose from 'mongoose';
import Employee, { IEmployee } from './employee.model';
import User from '../auth/user.model';
import Department from '../departments/department.model';
import { AppError } from '../../middleware/errorHandler';
import { getPagination } from '../../shared/utils';
import { PaginatedResponse } from '../../shared/types';
import { CreateEmployeeInput, UpdateEmployeeInput, EmployeeQuery } from './employee.schema';

export async function listEmployees(
  query: EmployeeQuery,
  departmentFilter?: string,
): Promise<PaginatedResponse<IEmployee>> {
  const { page, limit, skip } = getPagination(query);
  const filter: mongoose.FilterQuery<IEmployee> = { isActive: true };

  if (departmentFilter) filter.department = departmentFilter;
  if (query.department) filter.department = query.department;
  if (typeof query.isActive === 'boolean') filter.isActive = query.isActive;

  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [
      { firstName: regex },
      { lastName: regex },
      { email: regex },
      { position: regex },
    ];
  }

  const [data, total] = await Promise.all([
    Employee.find(filter)
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Employee.countDocuments(filter),
  ]);

  return {
    success: true,
    data: data as unknown as IEmployee[],
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getEmployeeById(id: string): Promise<IEmployee> {
  const employee = await Employee.findById(id)
    .populate('department', 'name description')
    .lean();
  if (!employee) throw new AppError('Employee not found.', 404);
  return employee as unknown as IEmployee;
}

export async function createEmployee(
  input: CreateEmployeeInput,
): Promise<IEmployee> {
  const dept = await Department.findById(input.department);
  if (!dept || !dept.isActive) throw new AppError('Department not found.', 404);

  // Block duplicate department heads
  if (input.isDepartmentHead) {
    const existing = await Employee.findOne({
      department: input.department,
      isDepartmentHead: true,
      isActive: true,
    });
    if (existing) {
      throw new AppError('This department already has a head.', 409);
    }
  }

  const employee = await Employee.create({
    ...input,
    dob: new Date(input.dob),
    hireDate: new Date(input.hireDate),
  });

  // Create linked user account
  const role = input.isDepartmentHead ? 'manager' : 'employee';
  await User.create({
    email: input.email,
    password: 'Password@123', // employee must change on first login
    role,
    employee: employee._id,
  });

  // Update department head reference
  if (input.isDepartmentHead) {
    await Department.findByIdAndUpdate(input.department, {
      head: employee._id,
    });
  }

  return employee;
}

export async function updateEmployee(
  id: string,
  input: UpdateEmployeeInput,
): Promise<IEmployee> {
  const employee = await Employee.findByIdAndUpdate(
    id,
    {
      ...input,
      ...(input.dob && { dob: new Date(input.dob) }),
      ...(input.hireDate && { hireDate: new Date(input.hireDate) }),
    },
    { new: true, runValidators: true },
  ).populate('department', 'name');

  if (!employee) throw new AppError('Employee not found.', 404);

  // Sync email change to linked user
  if (input.email) {
    await User.findOneAndUpdate(
      { employee: id },
      { email: input.email },
    );
  }

  return employee;
}

export async function softDeleteEmployee(id: string): Promise<void> {
  const employee = await Employee.findByIdAndUpdate(id, { isActive: false });
  if (!employee) throw new AppError('Employee not found.', 404);
  // Deactivate linked user account as well
  await User.findOneAndUpdate({ employee: id }, { isActive: false });
}
