
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { logger } from './shared/common/middleware/logger/logger.middleware';
import { CatsModule } from './modules/cats/cats.module';
import { UsersModule } from './modules/users/users.module';
import { appConfig } from './config';
import { validationSchema } from './config/validation.schema';

@Module({
  imports: [
    // Global config with simple Joi validation
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
      envFilePath: [
        `./config/${process.env.NODE_ENV || 'development'}.env`,
        './config/development.env', // fallback
      ],
      expandVariables: true,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    // Feature modules handle their own config via forFeature()
    CatsModule, 
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(logger)
      .forRoutes('cats', 'users');
  }
}
