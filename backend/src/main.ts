import "reflect-metadata";
import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  ValidationPipe,
  Logger,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { getRedisConfig, getKafkaConfig } from "./config";
import { TransformInterceptor } from "./core/common/interceptors/transform.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  // Enable WebSocket adapter for Socket.IO
  app.useWebSocketAdapter(new IoAdapter(app));

  // Connect microservices to the same app (using ConfigService)
  app.connectMicroservice(getRedisConfig(configService), {
    inheritAppConfig: true,
  });
  app.connectMicroservice(getKafkaConfig(configService), {
    inheritAppConfig: true,
  });

  // Global interceptors
  app.useGlobalInterceptors(
    new TransformInterceptor(), // Ensure all responses are JSON
    new ClassSerializerInterceptor(app.get(Reflector)) // Handle @Exclude() fields
  );

  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get<number>("app.port", 3000);
  const host = configService.get<string>("app.host", "localhost");
  const globalPrefix = configService.get<string>("app.globalPrefix");

  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix);
  }

  app.enableCors({
    origin: "http://localhost:4200",
    credentials: true,
  });

  // Start all microservices (Redis & Kafka listeners)
  await app.startAllMicroservices();

  logger.log(
    `🔴 Redis microservice connected on ${configService.get("redis.host")}:${configService.get("redis.port")}`
  );
  logger.log(
    `🟢 Kafka microservice connected to brokers: ${configService.get<string[]>("kafka.brokers")?.join(", ")}`
  );

  // Start HTTP server
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://${host}:${port}`);
  logger.log(`📊 Health check available at: http://${host}:${port}/health`);
  logger.log(`🌐 GraphQL Playground: http://${host}:${port}/graphql`);
  logger.log(`🔌 WebSocket Gateway: ws://${host}:${port}/events`);
  if (globalPrefix) {
    logger.log(`🔗 Global prefix set to: ${globalPrefix}`);
  }
}
bootstrap();
