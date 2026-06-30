import { Request, Response, NextFunction } from 'express';
import {
  loginService,
  refreshTokenService,
  logoutService,
  changePasswordService,
} from './auth.service';
import { asyncHandler } from '../../shared/utils';
import { AuthRequest } from '../../middleware/auth';

export const login = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { email, password } = req.body as { email: string; password: string };
    const { tokens, user } = await loginService(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: { user, ...tokens },
    });
  },
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { refreshToken: token } = req.body as { refreshToken: string };
    const { accessToken } = await refreshTokenService(token);

    res.status(200).json({ success: true, data: { accessToken } });
  },
);

export const logout = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    await logoutService(req.user!.id);
    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  },
);

export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };
    await changePasswordService(req.user!.id, currentPassword, newPassword);
    res
      .status(200)
      .json({ success: true, message: 'Password changed successfully.' });
  },
);

export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response, _next: NextFunction): Promise<void> => {
    res.status(200).json({ success: true, data: req.user });
  },
);
