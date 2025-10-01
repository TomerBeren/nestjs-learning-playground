import { registerAs } from '@nestjs/config';

export default registerAs('features', () => ({
  lazyLoading: process.env.LAZY_LOADING === 'true' || true,
  caching: process.env.CACHING === 'true' || process.env.NODE_ENV === 'production',
  cors: {
    enabled: process.env.CORS_ENABLED === 'true' || true,
    origin: process.env.CORS_ORIGIN || '*',
  },
  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'error' : 'debug'),
    enableConsole: process.env.CONSOLE_LOGGING !== 'false',
    enableFile: process.env.FILE_LOGGING === 'true' || process.env.NODE_ENV === 'production',
  },
}));