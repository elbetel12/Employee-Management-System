import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../shared/types';
export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: UserRole;
        email: string;
        employeeId?: string;
    };
}
export declare function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void;
export declare function authorize(...roles: UserRole[]): (req: AuthRequest, _res: Response, next: NextFunction) => void;
export declare function scopeDepartment(req: AuthRequest, _res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.d.ts.map