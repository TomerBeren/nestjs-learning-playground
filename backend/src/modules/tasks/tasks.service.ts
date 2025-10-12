import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor() {
    this.logger.log('🚀 TasksService initialized - Cron job registered');
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.logger.log('🔔 Cron job fired! Running every 10 minutes');
  }
}
