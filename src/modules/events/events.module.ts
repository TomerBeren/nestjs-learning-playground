import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisConfigModule } from '../../core/config-modules/redis-config.module';
import { KafkaConfigModule } from '../../core/config-modules/kafka-config.module';

// Organized imports
import { EventsGateway } from './gateways';
import { 
  RedisEventsController, 
  KafkaEventsController, 
  KafkaTestController 
} from './controllers';
import { KafkaProducerService } from './services';

@Module({
  imports: [
    RedisConfigModule,  // Only load Redis config here
    KafkaConfigModule,  // Only load Kafka config here
    // Kafka Client - for SENDING messages
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'nestdocs-app-client',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
          },
          consumer: {
            groupId: 'nestdocs-client-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [
    RedisEventsController,  // Redis microservice controller
    KafkaEventsController,  // Kafka microservice controller
    KafkaTestController,    // HTTP endpoints to test Kafka
  ],
  providers: [
    EventsGateway,          // WebSocket gateway
    KafkaProducerService,   // Kafka message sender
  ],
  exports: [EventsGateway, KafkaProducerService],
})
export class EventsModule {}
