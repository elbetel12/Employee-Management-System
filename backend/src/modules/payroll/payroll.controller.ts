import { Response, NextFunction } from 'express';
import * as svc from './payroll.service';
import { asyncHandler } from '../../shared/utils';
import { AuthRequest } from '../../middleware/auth';
import { GeneratePayrollInput, UpdatePayrollInput, PayrollQuery } from './payroll.schema';

export const list = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const deptId =
      req.user?.role === 'manager'
        ? (req as AuthRequest & { departmentId?: string }).departmentId
        : undefined;
    const result = await svc.listPayrolls(req.query as unknown as PayrollQuery, deptId);
    res.status(200).json(result);
  },
);

export const getOne = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const payroll = await svc.getPayrollById(req.params.id);
    res.status(200).json({ success: true, data: payroll });
  },
);

export const generate = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const result = await svc.generatePayroll(req.body as GeneratePayrollInput);
    res.status(201).json({
      success: true,
      message: `Payroll generated: ${result.created} created, ${result.skipped} skipped.`,
      data: result,
    });
  },
);

export const update = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const payroll = await svc.updatePayroll(req.params.id, req.body as UpdatePayrollInput);
    res.status(200).json({ success: true, data: payroll });
  },
);
