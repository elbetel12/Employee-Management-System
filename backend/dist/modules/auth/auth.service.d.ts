import { AuthTokens } from '../../shared/types';
import { IUser } from './user.model';
export declare function loginService(email: string, password: string): Promise<{
    tokens: AuthTokens;
    user: Partial<IUser>;
}>;
export declare function refreshTokenService(token: string): Promise<{
    accessToken: string;
}>;
export declare function logoutService(userId: string): Promise<void>;
export declare function changePasswordService(userId: string, currentPassword: string, newPassword: string): Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map