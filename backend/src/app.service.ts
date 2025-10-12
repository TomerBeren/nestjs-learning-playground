import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  private appSettings: any;

  constructor(
    private readonly configService: ConfigService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  onModuleInit() {
    // Access app-level configuration (loaded in forRoot)
    this.appSettings = {
      environment: this.configService.get<string>('app.environment'),
      host: this.configService.get<string>('app.host'),
      port: this.configService.get<number>('app.port'),
      globalPrefix: this.configService.get<string>('app.globalPrefix'),
    };
    
    console.log('🚀 App configuration loaded:', this.appSettings);
  }

  getHello(): string {
    const { environment, host, port } = this.appSettings;
    return `Hello World! NestJS App with Partial Config running in ${environment} mode on ${host}:${port}!`;
  }

  async getHealth(): Promise<object> {
    // Check database connection
    let dbStatus = 'disconnected';
    let dbType = 'unknown';
    try {
      if (this.dataSource.isInitialized) {
        dbStatus = 'connected';
        dbType = this.dataSource.options.type;
      }
    } catch (error) {
      dbStatus = 'error';
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      app: this.appSettings,
      database: {
        status: dbStatus,
        type: dbType,
      },
      configStrategy: 'partial-registration',
      modules: {
        app: 'forRoot() - global essential config',
        database: 'forFeature() - loaded in DatabaseModule',
        features: 'forFeature() - loaded in FeaturesModule',
        auth: 'forFeature() - loaded in AuthConfigModule',
      },
      note: 'Other namespace configs are loaded only in modules that need them',
    };
  }
}