import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload, Ctx, RedisContext } from '@nestjs/microservices';

@Controller()
export class RedisEventsController {
  private readonly logger = new Logger(RedisEventsController.name);

  /**
   * Message Pattern - Request/Response
   * Client sends message and waits for response
   */
  @MessagePattern('get_user')
  getUser(@Payload() data: any, @Ctx() context: RedisContext) {
    this.logger.log(`📨 Received 'get_user': ${JSON.stringify(data)}`);
    this.logger.log(`📍 Channel: ${context.getChannel()}`);
    
    return {
      id: data.id,
      name: 'John Doe',
      email: 'john@example.com',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Event Pattern - Fire and Forget
   * Client sends event but doesn't wait for response
   */
  @EventPattern('user_created')
  handleUserCreated(@Payload() data: any) {
    this.logger.log(`🎉 Event 'user_created': ${JSON.stringify(data)}`);
    // Do something (send email, update cache, etc.)
  }

  /**
   * Calculate sum example
   */
  @MessagePattern('calculate_sum')
  calculateSum(@Payload() data: { numbers: number[] }) {
    this.logger.log(`🔢 Calculating sum of: ${data.numbers}`);
    const sum = data.numbers.reduce((a, b) => a + b, 0);
    return { sum, count: data.numbers.length };
  }

  /**
   * Notification event
   */
  @EventPattern('notification_sent')
  handleNotification(@Payload() data: any) {
    this.logger.log(`📧 Notification: ${JSON.stringify(data)}`);
  }
}
