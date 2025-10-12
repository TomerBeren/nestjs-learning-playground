import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Module({
  providers: [TasksService],
})
export class TasksModule implements OnModuleInit {
  private readonly logger = new Logger(TasksModule.name);

  onModuleInit() {
    this.logger.log('✅ TasksModule has been initialized - Cron jobs should be active!');
  }
}
