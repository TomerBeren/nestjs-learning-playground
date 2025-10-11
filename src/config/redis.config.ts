import { RedisOptions, Transport } from '@nestjs/microservices';
import { registerAs, ConfigService } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
  retryAttempts: Number(process.env.REDIS_RETRY_ATTEMPTS ?? 10),
  retryDelay: Number(process.env.REDIS_RETRY_DELAY ?? 3000),
}));

export const getRedisConfig = (configService: ConfigService): RedisOptions => ({
  transport: Transport.REDIS,
  options: {
    host: configService.get('redis.host') as string,
    port: configService.get('redis.port') as number,
    retryAttempts: configService.get('redis.retryAttempts') as number,
    retryDelay: configService.get('redis.retryDelay') as number,
  },
});
