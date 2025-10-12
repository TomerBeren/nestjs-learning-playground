import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { KafkaProducerService } from '../services/kafka-producer.service';

@Controller('kafka-test')
export class KafkaTestController {
  private readonly logger = new Logger(KafkaTestController.name);

  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  /**
   * Test endpoint - Create an order via Kafka
   * POST http://localhost:3000/api/v1/kafka-test/order
   */
  @Post('order')
  async createOrder(@Body() orderData: any) {
    this.logger.log('🛒 HTTP Request: Creating order via Kafka');
    
    const order = {
      product: orderData.product || 'Test Product',
      quantity: orderData.quantity || 1,
      price: orderData.price || 99.99,
    };

    // Send message to Kafka and wait for response
    const response = await this.kafkaProducer.createOrder(order);
    
    return {
      success: true,
      message: 'Order sent to Kafka and processed',
      request: order,
      response: response,
    };
  }

  /**
   * Test endpoint - Process payment via Kafka
   * POST http://localhost:3000/api/v1/kafka-test/payment
   */
  @Post('payment')
  async processPayment(@Body() paymentData: any) {
    this.logger.log('💳 HTTP Request: Processing payment via Kafka');
    
    const payment = {
      amount: paymentData.amount || 150.00,
      currency: paymentData.currency || 'USD',
      cardLast4: paymentData.cardLast4 || '4242',
    };

    const response = await this.kafkaProducer.processPayment(payment);
    
    return {
      success: true,
      message: 'Payment sent to Kafka and processed',
      request: payment,
      response: response,
    };
  }

  /**
   * Test endpoint - Emit order status update event
   * POST http://localhost:3000/api/v1/kafka-test/order-status
   */
  @Post('order-status')
  async updateOrderStatus(@Body() statusData: any) {
    this.logger.log('📊 HTTP Request: Emitting order status update event');
    
    const status = {
      orderId: statusData.orderId || `ORD-${Date.now()}`,
      status: statusData.status || 'shipped',
      trackingNumber: statusData.trackingNumber || `TRACK-${Math.random().toString(36).substring(7)}`,
    };

    await this.kafkaProducer.emitOrderStatusUpdate(status);
    
    return {
      success: true,
      message: 'Order status event emitted to Kafka (fire and forget)',
      event: status,
    };
  }

  /**
   * Test endpoint - Track user activity
   * POST http://localhost:3000/api/v1/kafka-test/user-activity
   */
  @Post('user-activity')
  async trackActivity(@Body() activityData: any) {
    this.logger.log('👤 HTTP Request: Tracking user activity');
    
    const activity = {
      userId: activityData.userId || 'user-123',
      action: activityData.action || 'page_view',
      page: activityData.page || '/products',
      timestamp: new Date().toISOString(),
    };

    await this.kafkaProducer.emitUserActivity(activity);
    
    return {
      success: true,
      message: 'User activity event emitted to Kafka',
      event: activity,
    };
  }

  /**
   * Test endpoint - Send email notification
   * POST http://localhost:3000/api/v1/kafka-test/email
   */
  @Post('email')
  async sendEmail(@Body() emailData: any) {
    this.logger.log('📧 HTTP Request: Sending email notification');
    
    const email = {
      to: emailData.to || 'user@example.com',
      subject: emailData.subject || 'Test Email',
      body: emailData.body || 'This is a test email sent via Kafka!',
    };

    await this.kafkaProducer.emitEmailNotification(email);
    
    return {
      success: true,
      message: 'Email notification event emitted to Kafka',
      event: email,
    };
  }

  /**
   * Info endpoint - Get available test endpoints
   * GET http://localhost:3000/api/v1/kafka-test
   */
  @Get()
  getInfo() {
    return {
      message: 'Kafka Testing Endpoints',
      endpoints: [
        {
          method: 'POST',
          path: '/api/v1/kafka-test/order',
          description: 'Create order (Request/Response)',
          example: {
            product: 'Laptop',
            quantity: 2,
            price: 1200,
          },
        },
        {
          method: 'POST',
          path: '/api/v1/kafka-test/payment',
          description: 'Process payment (Request/Response)',
          example: {
            amount: 150.00,
            currency: 'USD',
            cardLast4: '4242',
          },
        },
        {
          method: 'POST',
          path: '/api/v1/kafka-test/order-status',
          description: 'Update order status (Fire and Forget)',
          example: {
            orderId: 'ORD-123',
            status: 'shipped',
            trackingNumber: 'TRACK-456',
          },
        },
        {
          method: 'POST',
          path: '/api/v1/kafka-test/user-activity',
          description: 'Track user activity (Fire and Forget)',
          example: {
            userId: 'user-123',
            action: 'page_view',
            page: '/products',
          },
        },
        {
          method: 'POST',
          path: '/api/v1/kafka-test/email',
          description: 'Send email notification (Fire and Forget)',
          example: {
            to: 'user@example.com',
            subject: 'Order Confirmation',
            body: 'Your order has been confirmed!',
          },
        },
      ],
    };
  }
}
