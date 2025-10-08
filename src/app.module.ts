import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { logger } from "./core/common/middleware/logger/logger.middleware";
import { CatsModule } from "./modules/cats/cats.module";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { AuthorsModule } from "./modules/authors/authors.module";
import { PostsModule } from "./modules/posts/posts.module";
import { validationSchema } from "./config/validation.schema";
import { CacheModule } from "@nestjs/cache-manager";
import { ScheduleModule } from "@nestjs/schedule";
import { GraphqlConfigModule } from "./shared/graphql/graphql.module";
import { appConfig } from "./config";

@Module({
  imports: [
    // Global config with simple Joi validation
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig],
      envFilePath: [
        `./config/${process.env.NODE_ENV || "development"}.env`,
        "./config/development.env", // fallback
      ],
      expandVariables: true,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    // GraphQL configuration
    GraphqlConfigModule,
    // Initialize ScheduleModule FIRST before any module that uses @Cron
    ScheduleModule.forRoot(),
    CacheModule.register({
      ttl: 5, // seconds
      max: 100, // maximum number of items in cache
    }),
    // Feature modules
    CatsModule,
    UsersModule,
    AuthModule,
    TasksModule,
    AuthorsModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes("cats", "users", "auth");
  }
}
