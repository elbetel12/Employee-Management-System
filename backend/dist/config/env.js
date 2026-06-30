"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const requiredEnv = [
    'MONGODB_URI',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
];
for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}
exports.config = {
    env: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '5000', 10),
    mongoUri: process.env.MONGODB_URI,
    clientUrl: process.env.CLIENT_URL
        ? (process.env.CLIENT_URL.startsWith('http') ? process.env.CLIENT_URL : `https://${process.env.CLIENT_URL}`)
        : 'http://localhost:5173',
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    },
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE ?? '5242880', 10),
        path: process.env.UPLOAD_PATH ?? 'uploads/',
    },
};
//# sourceMappingURL=env.js.map