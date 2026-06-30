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
exports.update = exports.manualEntry = exports.qrScan = exports.list = void 0;
const svc = __importStar(require("./attendance.service"));
const utils_1 = require("../../shared/utils");
exports.list = (0, utils_1.asyncHandler)(async (req, res, _) => {
    const query = req.query;
    if (req.user?.role === 'employee' && req.user.employeeId) {
        query.employeeId = req.user.employeeId;
    }
    const deptId = req.user?.role === 'manager'
        ? req.departmentId
        : undefined;
    const result = await svc.listAttendance(query, deptId);
    res.status(200).json(result);
});
exports.qrScan = (0, utils_1.asyncHandler)(async (req, res, _) => {
    const { email } = req.body;
    const message = await svc.processQrScan(email);
    res.status(200).json({ success: true, message });
});
exports.manualEntry = (0, utils_1.asyncHandler)(async (req, res, _) => {
    const record = await svc.createManualAttendance(req.body);
    res.status(201).json({ success: true, data: record });
});
exports.update = (0, utils_1.asyncHandler)(async (req, res, _) => {
    const record = await svc.updateAttendance(req.params.id, req.body);
    res.status(200).json({ success: true, data: record });
});
//# sourceMappingURL=attendance.controller.js.map