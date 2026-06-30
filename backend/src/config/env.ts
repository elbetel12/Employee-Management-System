import dotenv from 'dotenv';
dotenv.config();

const requiredEnv = [
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
] as const;

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '5000', 10),
  mongoUri: process.env.MONGODB_URI as string,
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE ?? '5242880', 10),
    path: process.env.UPLOAD_PATH ?? 'uploads/',
  },
} as const;
