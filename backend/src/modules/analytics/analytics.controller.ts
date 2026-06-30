import { Response, NextFunction } from 'express';
import * as svc from './analytics.service';
import { asyncHandler } from '../../shared/utils';
import { AuthRequest } from '../../middleware/auth';
import { WorkHoursQuery } from './analytics.schema';
import * as XLSX from 'xlsx';

export const dashboard = asyncHandler(
  async (_req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const stats = await svc.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  },
);

export const workHours = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const { month, year, department } = req.query as unknown as WorkHoursQuery;
    const deptId =
      req.user?.role === 'manager'
        ? (req as AuthRequest & { departmentId?: string }).departmentId
        : (department as string | undefined);

    const report = await svc.getWorkHoursReport(month, year, deptId);
    res.status(200).json({ success: true, data: report });
  },
);

export const exportWorkHours = asyncHandler(
  async (req: AuthRequest, res: Response, _: NextFunction): Promise<void> => {
    const { month, year, department } = req.query as unknown as WorkHoursQuery;
    const deptId =
      req.user?.role === 'manager'
        ? (req as AuthRequest & { departmentId?: string }).departmentId
        : (department as string | undefined);

    const report = await svc.getWorkHoursReport(month, year, deptId);

    // Calculate days in this month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Prepare rows for SheetJS
    const rows = report.map((emp) => {
      const row: Record<string, any> = {
        Employee: emp.name,
        Department: emp.department,
      };

      // Initialize all days of the month with 0 hours
      for (let day = 1; day <= daysInMonth; day++) {
        row[String(day)] = 0;
      }

      // Fill in hours from dailyBreakdown
      emp.dailyBreakdown.forEach((item) => {
        const dateObj = new Date(item.date);
        const day = dateObj.getDate();
        row[String(day)] = item.hours;
      });

      row['Total Hours'] = emp.totalHours;
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Work Hours ${month}-${year}`);

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=work_hours_report_${month}_${year}.xlsx`,
    );
    res.status(200).send(buffer);
  },
);

