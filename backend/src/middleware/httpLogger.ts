import morgan from 'morgan';
import { logger } from '../config/logger';
import { config } from '../config/env';

const stream = {
  write: (message: string) => logger.http(message.trim()),
};

export const httpLogger = morgan(
  config.env === 'production' ? 'combined' : 'dev',
  { stream },
);
