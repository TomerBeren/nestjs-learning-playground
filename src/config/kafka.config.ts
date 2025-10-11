import { KafkaOptions, Transport } from '@nestjs/microservices';
import { registerAs, ConfigService } from '@nestjs/config';

export default registerAs('kafka', () => ({
  clientId: process.env.KAFKA_CLIENT_ID ?? 'nestdocs-app',
  brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
  groupId: process.env.KAFKA_GROUP_ID ?? 'nestdocs-consumer',
}));

export const getKafkaConfig = (configService: ConfigService): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: configService.get('kafka.clientId') as string,
      brokers: (configService.get('kafka.brokers') ?? ['localhost:9092']) as string[],
      retry: {
        initialRetryTime: 300,
        retries: 10,
      },
    },
    consumer: {
      groupId: configService.get('kafka.groupId') ?? 'nestdocs-consumer',
      retry: {
        initialRetryTime: 300,
        retries: 10,
      },
    },
  },
});
