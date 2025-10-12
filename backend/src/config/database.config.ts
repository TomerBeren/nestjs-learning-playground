import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => {
  const dbType = (process.env.DB_TYPE as 'postgres' | 'sqlite') || 'postgres';
  
  const baseConfig = {
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    entities: ['dist/**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
  };

  if (dbType === 'postgres') {
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'nestdocs',
      migrations: ['dist/migrations/*{.ts,.js}'],
      ...baseConfig,
    } as TypeOrmModuleOptions;
  } else {
    return {
      type: 'sqlite',
      database: process.env.SQLITE_DB || 'nestdocs.db',
      ...baseConfig,
    } as TypeOrmModuleOptions;
  }
});