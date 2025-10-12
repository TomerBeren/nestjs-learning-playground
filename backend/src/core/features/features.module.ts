import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import featuresConfig from '../../config/features.config';

@Injectable()
export class FeaturesService implements OnModuleInit {
  private featureSettings: any;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // ✅ Safe to access forFeature() config here - all modules are initialized
    this.featureSettings = this.configService.get('features');
    console.log('🎯 Features loaded:', {
      lazyLoading: this.featureSettings?.lazyLoading,
      caching: this.featureSettings?.caching,
      logging: this.featureSettings?.logging?.level,
    });
  }

  getFeatures() {
    return this.featureSettings;
  }

  isCachingEnabled(): boolean {
    return this.featureSettings?.caching || false;
  }

  getLogLevel(): string {
    return this.featureSettings?.logging?.level || 'info';
  }
}

@Module({
  imports: [
    ConfigModule.forFeature(featuresConfig),
  ],
  providers: [FeaturesService],
  exports: [FeaturesService],
})
export class FeaturesModule {}