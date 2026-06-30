"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = require("./logger");
async function connectDB() {
    try {
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(env_1.config.mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        });
        logger_1.logger.info(`MongoDB connected: ${mongoose_1.default.connection.host}`);
    }
    catch (error) {
        logger_1.logger.error('MongoDB connection error:', error);
        process.exit(1);
    }
    mongoose_1.default.connection.on('disconnected', () => {
        logger_1.logger.warn('MongoDB disconnected. Retrying...');
    });
    mongoose_1.default.connection.on('error', (err) => {
        logger_1.logger.error('MongoDB error:', err);
    });
}
//# sourceMappingURL=database.js.map