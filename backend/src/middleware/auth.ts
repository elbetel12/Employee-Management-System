import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { AppError } from './errorHandler';
import { UserRole } from '../shared/types';
import User from '../modules/auth/user.model';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    email: string;
    employeeId?: string;
  };
}

export function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return next(new AppError('No token provided.', 401));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwt.accessSecret) as {
      id: string;
      role: UserRole;
      email: string;
      employeeId?: string;
    };
    req.user = payload;
    next();
  } catch {
    next(new AppError('Invalid or expired token.', 401));
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AppError('Unauthenticated.', 401));
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403),
      );
    }
    next();
  };
}

// Scope: managers can only see their department's employees
export async function scopeDepartment(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) return next(new AppError('Unauthenticated.', 401));
    if (req.user.role === 'admin') return next(); // admins see everything

    const user = await User.findById(req.user.id).populate({
      path: 'employee',
      select: 'department',
    });

    if (!user?.employee) {
      return next(new AppError('User has no linked employee record.', 400));
    }

    // Attach the department id to the request for controller use
    (req as AuthRequest & { departmentId?: string }).departmentId = (
      user.employee as unknown as { department: string }
    ).department?.toString();

    next();
  } catch (err) {
    next(err);
  }
}
