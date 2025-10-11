import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsController } from './events.controller';
import { EventsKafkaController } from './events-kafka.controller';
import { RedisConfigModule } from '../../core/config-modules/redis-config.module';
import { KafkaConfigModule } from '../../core/config-modules/kafka-config.module';

@Module({
  imports: [
    RedisConfigModule,  // Only load Redis config here
    KafkaConfigModule,  // Only load Kafka config here
  ],
  controllers: [
    EventsController,       // Redis microservice
    EventsKafkaController,  // Kafka microservice
  ],
  providers: [EventsGateway], // WebSocket gateway
  exports: [EventsGateway],
})
export class EventsModule {}
