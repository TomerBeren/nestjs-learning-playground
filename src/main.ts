import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');
  
  // Enable automatic serialization (excludes @Exclude() fields)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
  app.useGlobalPipes(new ValidationPipe());
  
  const port = configService.get<number>('app.port', 3000);
  const host = configService.get<string>('app.host', 'localhost');
  const globalPrefix = configService.get<string>('app.globalPrefix');
  
  if (globalPrefix) {
    app.setGlobalPrefix(globalPrefix);
  }
  
  await app.listen(port);
  
  logger.log(`🚀 Application is running on: http://${host}:${port}`);
  logger.log(`📊 Health check available at: http://${host}:${port}/health`);
  logger.log(`� Configuration loaded with namespaces: app, database, auth, features`);
  if (globalPrefix) {
    logger.log(`🔗 Global prefix set to: ${globalPrefix}`);
  }
}
bootstrap();
