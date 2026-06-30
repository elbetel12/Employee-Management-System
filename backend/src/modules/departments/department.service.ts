import Department, { IDepartment } from './department.model';
import { AppError } from '../../middleware/errorHandler';
import { getPagination } from '../../shared/utils';
import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentQuery,
} from './department.schema';
import { PaginatedResponse } from '../../shared/types';

export async function listDepartments(
  query: DepartmentQuery,
): Promise<PaginatedResponse<IDepartment>> {
  const { page, limit, skip } = getPagination(query);
  const filter: Record<string, unknown> = { isActive: true };

  if (query.search) {
    filter.name = new RegExp(query.search, 'i');
  }

  const [data, total] = await Promise.all([
    Department.find(filter)
      .populate('head', 'firstName lastName position')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Department.countDocuments(filter),
  ]);

  return {
    success: true,
    data: data as unknown as IDepartment[],
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getDepartmentById(id: string): Promise<IDepartment> {
  const dept = await Department.findById(id)
    .populate('head', 'firstName lastName position email')
    .lean();
  if (!dept) throw new AppError('Department not found.', 404);
  return dept as unknown as IDepartment;
}

export async function createDepartment(
  input: CreateDepartmentInput,
): Promise<IDepartment> {
  const exists = await Department.findOne({ name: input.name });
  if (exists) throw new AppError('A department with this name already exists.', 409);
  return Department.create(input);
}

export async function updateDepartment(
  id: string,
  input: UpdateDepartmentInput,
): Promise<IDepartment> {
  const dept = await Department.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  }).populate('head', 'firstName lastName');
  if (!dept) throw new AppError('Department not found.', 404);
  return dept;
}

export async function softDeleteDepartment(id: string): Promise<void> {
  const dept = await Department.findByIdAndUpdate(id, { isActive: false });
  if (!dept) throw new AppError('Department not found.', 404);
}
