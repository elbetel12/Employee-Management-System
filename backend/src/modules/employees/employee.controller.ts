import { Response, NextFunction } from 'express';
import * as employeeService from './employee.service';
import { asyncHandler } from '../../shared/utils';
import { AuthRequest } from '../../middleware/auth';
import { CreateEmployeeInput, UpdateEmployeeInput, EmployeeQuery } from './employee.schema';

export const list = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const departmentId =
      req.user?.role === 'manager'
        ? (req as AuthRequest & { departmentId?: string }).departmentId
        : undefined;

    const result = await employeeService.listEmployees(
      req.query as unknown as EmployeeQuery,
      departmentId,
    );
    res.status(200).json(result);
  },
);

export const getOne = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.status(200).json({ success: true, data: employee });
  },
);

export const create = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const employee = await employeeService.createEmployee(
      req.body as CreateEmployeeInput,
    );
    res
      .status(201)
      .json({ success: true, message: 'Employee created.', data: employee });
  },
);

export const update = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const employee = await employeeService.updateEmployee(
      req.params.id,
      req.body as UpdateEmployeeInput,
    );
    res.status(200).json({ success: true, data: employee });
  },
);

export const remove = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    await employeeService.softDeleteEmployee(req.params.id);
    res
      .status(200)
      .json({ success: true, message: 'Employee deactivated successfully.' });
  },
);
