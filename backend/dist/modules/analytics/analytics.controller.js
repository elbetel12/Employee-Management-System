"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportWorkHours = exports.workHours = exports.dashboard = void 0;
const svc = __importStar(require("./analytics.service"));
const utils_1 = require("../../shared/utils");
const XLSX = __importStar(require("xlsx"));
exports.dashboard = (0, utils_1.asyncHandler)(async (_req, res, _) => {
    const stats = await svc.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
});
exports.workHours = (0, utils_1.asyncHandler)(async (req, res, _) => {
    const { month, year, department } = req.query;
    const deptId = req.user?.role === 'manager'
        ? req.departmentId
        : department;
    const report = await svc.getWorkHoursReport(month, year, deptId);
    res.status(200).json({ success: true, data: report });
});
exports.exportWorkHours = (0, utils_1.asyncHandler)(async (req, res, _) => {
    const { month, year, department } = req.query;
    const deptId = req.user?.role === 'manager'
        ? req.departmentId
        : department;
    const report = await svc.getWorkHoursReport(month, year, deptId);
    // Calculate days in this month
    const daysInMonth = new Date(year, month, 0).getDate();
    // Prepare rows for SheetJS
    const rows = report.map((emp) => {
        const row = {
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
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=work_hours_report_${month}_${year}.xlsx`);
    res.status(200).send(buffer);
});
//# sourceMappingURL=analytics.controller.js.map