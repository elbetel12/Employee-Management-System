import { Response, NextFunction } from 'express';
import * as svc from './department.service';
import { asyncHandler } from '../../shared/utils';
import { AuthRequest } from '../../middleware/auth';
import {
  CreateDepartmentInput,
  UpdateDepartmentInput,
  DepartmentQuery,
} from './department.schema';

export const list = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const result = await svc.listDepartments(req.query as unknown as DepartmentQuery);
    res.status(200).json(result);
  },
);

export const getOne = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const dept = await svc.getDepartmentById(req.params.id);
    res.status(200).json({ success: true, data: dept });
  },
);

export const create = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const dept = await svc.createDepartment(req.body as CreateDepartmentInput);
    res.status(201).json({ success: true, message: 'Department created.', data: dept });
  },
);

export const update = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const dept = await svc.updateDepartment(req.params.id, req.body as UpdateDepartmentInput);
    res.status(200).json({ success: true, data: dept });
  },
);

export const remove = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    await svc.softDeleteDepartment(req.params.id);
    res.status(200).json({ success: true, message: 'Department deleted.' });
  },
);
