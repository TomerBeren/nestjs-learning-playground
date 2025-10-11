import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import kafkaConfig from '../../config/kafka.config';

@Module({
  imports: [
    ConfigModule.forFeature(kafkaConfig),
  ],
  exports: [ConfigModule],
})
export class KafkaConfigModule {}
