import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';

@Controller()
export class EventsKafkaController {
  private readonly logger = new Logger(EventsKafkaController.name);

  /**
   * Kafka Message Pattern - Request/Response
   * Processes order and returns confirmation
   */
  @MessagePattern('orders.create')
  async createOrder(@Payload() data: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();

    this.logger.log(`📦 Kafka Message - Topic: ${topic}, Partition: ${partition}, Offset: ${offset}`);
    this.logger.log(`📦 Order data: ${JSON.stringify(data)}`);

    // Process order
    const order = {
      orderId: `ORD-${Date.now()}`,
      ...data,
      status: 'created',
      createdAt: new Date().toISOString(),
    };

    return order;
  }

  /**
   * Kafka Event Pattern - Fire and Forget
   * Handles order status updates
   */
  @EventPattern('orders.status-updated')
  async handleOrderStatusUpdate(@Payload() data: any, @Ctx() context: KafkaContext) {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();

    this.logger.log(`📊 Status Update - Topic: ${topic}, Partition: ${partition}, Offset: ${offset}`);
    this.logger.log(`📊 Data: ${JSON.stringify(data)}`);

    // Handle status update (send email, update database, etc.)
  }

  /**
   * Payment processing example
   */
  @MessagePattern('payments.process')
  async processPayment(@Payload() data: any, @Ctx() context: KafkaContext) {
    this.logger.log(`💳 Processing payment: ${JSON.stringify(data)}`);
    
    // Simulate payment processing
    const payment = {
      paymentId: `PAY-${Date.now()}`,
      amount: data.amount,
      currency: data.currency || 'USD',
      status: 'success',
      transactionId: `TXN-${Math.random().toString(36).substring(7)}`,
      processedAt: new Date().toISOString(),
    };

    return payment;
  }

  /**
   * User activity tracking event
   */
  @EventPattern('users.activity')
  async trackUserActivity(@Payload() data: any, @Ctx() context: KafkaContext) {
    const { offset } = context.getMessage();
    this.logger.log(`👤 User activity tracked (offset: ${offset}): ${JSON.stringify(data)}`);
    
    // Track analytics, update user stats, etc.
  }

  /**
   * Email notification event
   */
  @EventPattern('notifications.email')
  async sendEmail(@Payload() data: any) {
    this.logger.log(`📧 Sending email to: ${data.to}`);
    this.logger.log(`📧 Subject: ${data.subject}`);
    
    // Send email via email service
  }
}
