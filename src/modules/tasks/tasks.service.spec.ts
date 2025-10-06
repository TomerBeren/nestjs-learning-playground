import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleCron', () => {
    it('should log when cron job executes', () => {
      // Arrange
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      // Act
      service.handleCron();

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith('🔔 Cron job fired! Running every 10 minutes');
      
      // Cleanup
      loggerSpy.mockRestore();
    });

    it('should not throw errors when called', () => {
      // Act & Assert
      expect(() => service.handleCron()).not.toThrow();
    });
  });
});
