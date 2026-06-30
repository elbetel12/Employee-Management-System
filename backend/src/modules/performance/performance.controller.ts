import { Response, NextFunction } from 'express';
import * as svc from './performance.service';
import { asyncHandler } from '../../shared/utils';
import { AuthRequest } from '../../middleware/auth';
import { EvaluateInput, PerformanceQuery } from './performance.schema';

export const list = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const query = req.query as unknown as PerformanceQuery;
    if (req.user?.role === 'employee' && req.user.employeeId) {
      query.employeeId = req.user.employeeId;
    }
    const deptId =
      req.user?.role === 'manager'
        ? (req as AuthRequest & { departmentId?: string }).departmentId
        : undefined;
    const result = await svc.listPerformances(
      query,
      deptId,
    );
    res.status(200).json(result);
  },
);

export const evaluate = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const record = await svc.evaluateEmployee(
      req.params.employeeId,
      req.user!.id,
      req.body as EvaluateInput,
    );
    res.status(201).json({ success: true, data: record });
  },
);
