import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || 'localhost',
  environment: process.env.NODE_ENV || 'development',
  globalPrefix: process.env.API_PREFIX || 'api/v1',
}));