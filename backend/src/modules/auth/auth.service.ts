import jwt from 'jsonwebtoken';
import { config } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';
import { TokenPayload, AuthTokens, UserRole } from '../../shared/types';
import User, { IUser } from './user.model';

function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  } as jwt.SignOptions);
}

function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);
}

export async function loginService(
  email: string,
  password: string,
): Promise<{ tokens: AuthTokens; user: Partial<IUser> }> {
  const user = await User.findOne({ email, isActive: true }).select(
    '+password +refreshToken',
  );

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  const payload: TokenPayload = {
    id: user._id.toString(),
    role: user.role as UserRole,
    email: user.email,
    employeeId: user.employee?.toString(),
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Persist hashed refresh token
  user.refreshToken = refreshToken;
  await user.save();

  return {
    tokens: { accessToken, refreshToken },
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
      employee: user.employee,
    },
  };
}

export async function refreshTokenService(
  token: string,
): Promise<{ accessToken: string }> {
  let payload: TokenPayload;

  try {
    payload = jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
  } catch {
    throw new AppError('Invalid or expired refresh token.', 401);
  }

  const user = await User.findById(payload.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new AppError('Refresh token revoked or not found.', 401);
  }

  const newPayload: TokenPayload = {
    id: user._id.toString(),
    role: user.role as UserRole,
    email: user.email,
    employeeId: user.employee?.toString(),
  };

  return { accessToken: signAccessToken(newPayload) };
}

export async function logoutService(userId: string): Promise<void> {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
}

export async function changePasswordService(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError('User not found.', 404);

  const valid = await user.comparePassword(currentPassword);
  if (!valid) throw new AppError('Current password is incorrect.', 400);

  user.password = newPassword;
  user.refreshToken = undefined;
  await user.save();
}
