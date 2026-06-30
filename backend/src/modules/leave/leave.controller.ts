import { Response, NextFunction } from 'express';
import * as svc from './leave.service';
import { asyncHandler } from '../../shared/utils';
import { AuthRequest } from '../../middleware/auth';
import { CreateLeaveInput, UpdateLeaveInput, LeaveQuery } from './leave.schema';

export const list = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const query = req.query as unknown as LeaveQuery;
    if (req.user?.role === 'employee' && req.user.employeeId) {
      query.employeeId = req.user.employeeId;
    }
    const deptId =
      req.user?.role === 'manager'
        ? (req as AuthRequest & { departmentId?: string }).departmentId
        : undefined;
    const result = await svc.listLeaves(query, deptId);
    res.status(200).json(result);
  },
);

export const create = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const leave = await svc.createLeave(req.body as CreateLeaveInput, req.user!.id);
    res.status(201).json({ success: true, message: 'Leave request submitted.', data: leave });
  },
);

export const update = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const leave = await svc.updateLeave(req.params.id, req.body as UpdateLeaveInput);
    res.status(200).json({ success: true, data: leave });
  },
);

export const remove = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    await svc.deleteLeave(req.params.id);
    res.status(200).json({ success: true, message: 'Leave deleted.' });
  },
);
