import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import authConfig from '../../config/auth.config';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
  ],
  exports: [ConfigModule],
})
export class AuthConfigModule {}