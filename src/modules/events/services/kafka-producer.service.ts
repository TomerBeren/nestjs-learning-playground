import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaProducerService.name);

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // Subscribe to reply topics for request-response patterns
    // This tells Kafka which topics will send responses back
    this.kafkaClient.subscribeToResponseOf('orders.create');
    this.kafkaClient.subscribeToResponseOf('payments.process');
    
    // Connect the Kafka client when the module initializes
    await this.kafkaClient.connect();
    this.logger.log('📤 Kafka Producer Client connected');
    this.logger.log('📩 Subscribed to reply topics: orders.create, payments.process');
  }

  /**
   * Send a message and wait for response (Request/Response pattern)
   */
  async sendMessage<T = any>(topic: string, message: any): Promise<T> {
    this.logger.log(`📤 Sending message to topic '${topic}': ${JSON.stringify(message)}`);
    
    try {
      const response = await this.kafkaClient.send<T>(topic, message).toPromise();
      this.logger.log(`📥 Received response from '${topic}': ${JSON.stringify(response)}`);
      
      if (!response) {
        throw new Error('No response received from Kafka');
      }
      
      return response;
    } catch (error) {
      this.logger.error(`❌ Error sending message to '${topic}':`, error);
      throw error;
    }
  }

  /**
   * Emit an event (Fire and Forget pattern)
   */
  async emitEvent(topic: string, event: any): Promise<void> {
    this.logger.log(`🔔 Emitting event to topic '${topic}': ${JSON.stringify(event)}`);
    
    try {
      this.kafkaClient.emit(topic, event);
      this.logger.log(`✅ Event emitted to '${topic}'`);
    } catch (error) {
      this.logger.error(`❌ Error emitting event to '${topic}':`, error);
      throw error;
    }
  }

  /**
   * Convenience methods for specific topics
   */

  async createOrder(orderData: any) {
    return this.sendMessage('orders.create', orderData);
  }

  async processPayment(paymentData: any) {
    return this.sendMessage('payments.process', paymentData);
  }

  async emitOrderStatusUpdate(statusData: any) {
    return this.emitEvent('orders.status-updated', statusData);
  }

  async emitUserActivity(activityData: any) {
    return this.emitEvent('users.activity', activityData);
  }

  async emitEmailNotification(emailData: any) {
    return this.emitEvent('notifications.email', emailData);
  }
}
