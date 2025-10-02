import { UserSubscriber } from './user.subscriber';
import { User } from '../entities/user.entity';
import { DataSource, InsertEvent } from 'typeorm';

describe('UserSubscriber', () => {
  let userSubscriber: UserSubscriber;
  let mockDataSource: jest.Mocked<DataSource>;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create a mock DataSource
    mockDataSource = {
      subscribers: [],
    } as any;

    // Create the subscriber instance
    userSubscriber = new UserSubscriber(mockDataSource);

    // Spy on console.log
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    // Restore console.log after each test
    consoleLogSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(userSubscriber).toBeDefined();
  });

  it('should register itself with the DataSource', () => {
    expect(mockDataSource.subscribers).toContain(userSubscriber);
    expect(mockDataSource.subscribers.length).toBe(1);
  });

  it('should listen to User entity', () => {
    const result = userSubscriber.listenTo();
    expect(result).toBe(User);
  });

  describe('beforeInsert', () => {
    it('should log before user is inserted', () => {
      // Arrange
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: 'hashedPassword123',
        isActive: true,
        cats: [],
      } as User;

      const mockInsertEvent = {
        entity: mockUser,
        manager: {} as any,
        queryRunner: {} as any,
      } as InsertEvent<User>;

      // Act
      userSubscriber.beforeInsert(mockInsertEvent);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'BEFORE USER INSERTED: ',
        mockUser,
      );
    });

    it('should log even if user entity is partially filled', () => {
      // Arrange
      const mockUser = {
        username: 'partial',
        password: 'pass123',
      } as unknown as User;

      const mockInsertEvent = {
        entity: mockUser,
        manager: {} as any,
        queryRunner: {} as any,
      } as InsertEvent<User>;

      // Act
      userSubscriber.beforeInsert(mockInsertEvent);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'BEFORE USER INSERTED: ',
        mockUser,
      );
    });

    it('should handle multiple insert events', () => {
      // Arrange
      const mockUser1 = {
        username: 'user1',
        password: 'pass1',
      } as unknown as User;

      const mockUser2 = {
        username: 'user2',
        password: 'pass2',
      } as unknown as User;

      const mockInsertEvent1 = {
        entity: mockUser1,
        manager: {} as any,
        queryRunner: {} as any,
      } as InsertEvent<User>;

      const mockInsertEvent2 = {
        entity: mockUser2,
        manager: {} as any,
        queryRunner: {} as any,
      } as InsertEvent<User>;

      // Act
      userSubscriber.beforeInsert(mockInsertEvent1);
      userSubscriber.beforeInsert(mockInsertEvent2);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        1,
        'BEFORE USER INSERTED: ',
        mockUser1,
      );
      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        2,
        'BEFORE USER INSERTED: ',
        mockUser2,
      );
    });
  });
});
