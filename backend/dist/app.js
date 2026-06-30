"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const logger_1 = require("./config/logger");
const httpLogger_1 = require("./middleware/httpLogger");
const errorHandler_1 = require("./middleware/errorHandler");
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
// ─── Security ────────────────────────────────────────────────────────────────
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use((0, express_mongo_sanitize_1.default)()); // Block NoSQL injection
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
}));
// ─── Body parsing & utilities ─────────────────────────────────────────────────
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
app.use(httpLogger_1.httpLogger);
// ─── Static uploads ───────────────────────────────────────────────────────────
app.use('/uploads', express_1.default.static(env_1.config.upload.path));
// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', env: env_1.config.env, ts: new Date().toISOString() });
});
// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1', router_1.default);
// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
});
// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler_1.errorHandler);
// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function bootstrap() {
    await (0, database_1.connectDB)();
    const server = app.listen(env_1.config.port, () => {
        logger_1.logger.info(`🚀 Server running on http://localhost:${env_1.config.port} [${env_1.config.env}]`);
    });
    // Graceful shutdown
    const shutdown = (signal) => {
        logger_1.logger.warn(`${signal} received — shutting down gracefully`);
        server.close(() => {
            logger_1.logger.info('HTTP server closed.');
            process.exit(0);
        });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
bootstrap().catch((err) => {
    logger_1.logger.error('Failed to start server:', err);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=app.js.map