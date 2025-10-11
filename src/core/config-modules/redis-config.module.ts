import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import redisConfig from '../../config/redis.config';

@Module({
  imports: [
    ConfigModule.forFeature(redisConfig),
  ],
  exports: [ConfigModule],
})
export class RedisConfigModule {}
