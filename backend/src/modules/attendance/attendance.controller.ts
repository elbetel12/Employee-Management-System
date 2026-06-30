import { Response, NextFunction } from 'express';
import * as svc from './attendance.service';
import { asyncHandler } from '../../shared/utils';
import { AuthRequest } from '../../middleware/auth';
import {
  QrCheckInput,
  ManualAttendanceInput,
  UpdateAttendanceInput,
  AttendanceQuery,
} from './attendance.schema';

export const list = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const query = req.query as unknown as AttendanceQuery;
    if (req.user?.role === 'employee' && req.user.employeeId) {
      query.employeeId = req.user.employeeId;
    }
    const deptId =
      req.user?.role === 'manager'
        ? (req as AuthRequest & { departmentId?: string }).departmentId
        : undefined;
    const result = await svc.listAttendance(query, deptId);
    res.status(200).json(result);
  },
);

export const qrScan = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const { email } = req.body as QrCheckInput;
    const message = await svc.processQrScan(email);
    res.status(200).json({ success: true, message });
  },
);

export const manualEntry = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const record = await svc.createManualAttendance(req.body as ManualAttendanceInput);
    res.status(201).json({ success: true, data: record });
  },
);

export const update = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const record = await svc.updateAttendance(req.params.id, req.body as UpdateAttendanceInput);
    res.status(200).json({ success: true, data: record });
  },
);
