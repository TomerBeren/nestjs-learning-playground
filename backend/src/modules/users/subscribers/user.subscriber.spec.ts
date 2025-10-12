import { UserSubscriber } from './user.subscriber';
import { User } from '../entities/user.entity';
import { DataSource, InsertEvent } from 'typeorm';
import { BcryptUtil } from '../../../core/common/utils/bcrypt.util';

// Mock BcryptUtil
jest.mock('../../../core/common/utils/bcrypt.util');

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
    
    // Reset mocks
    jest.clearAllMocks();
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
    it('should log before user is inserted and hash password', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: 'plainPassword123',
        isActive: true,
        cats: [],
      } as User;

      const mockInsertEvent = {
        entity: mockUser,
        manager: {} as any,
        queryRunner: {} as any,
      } as InsertEvent<User>;
      
      // Mock BcryptUtil.hashPassword to return a hashed password
      (BcryptUtil.hashPassword as jest.Mock).mockResolvedValue('$2b$10$hashedPassword');

      // Act
      await userSubscriber.beforeInsert(mockInsertEvent);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'BEFORE USER INSERTED: ',
        mockUser,
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Password hashed for user: johndoe',
      );
      expect(BcryptUtil.hashPassword).toHaveBeenCalledWith('plainPassword123');
      expect(mockUser.password).toBe('$2b$10$hashedPassword');
    });

    it('should log even if user entity is partially filled and hash password', async () => {
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
      
      (BcryptUtil.hashPassword as jest.Mock).mockResolvedValue('$2b$10$hashed');

      // Act
      await userSubscriber.beforeInsert(mockInsertEvent);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledTimes(2);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'BEFORE USER INSERTED: ',
        mockUser,
      );
      expect(BcryptUtil.hashPassword).toHaveBeenCalledWith('pass123');
      expect(mockUser.password).toBe('$2b$10$hashed');
    });

    it('should handle multiple insert events', async () => {
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
      
      (BcryptUtil.hashPassword as jest.Mock)
        .mockResolvedValueOnce('$2b$10$hashed1')
        .mockResolvedValueOnce('$2b$10$hashed2');

      // Act
      await userSubscriber.beforeInsert(mockInsertEvent1);
      await userSubscriber.beforeInsert(mockInsertEvent2);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledTimes(4);
      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        1,
        'BEFORE USER INSERTED: ',
        mockUser1,
      );
      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        2,
        'Password hashed for user: user1',
      );
      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        3,
        'BEFORE USER INSERTED: ',
        mockUser2,
      );
      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        4,
        'Password hashed for user: user2',
      );
      expect(mockUser1.password).toBe('$2b$10$hashed1');
      expect(mockUser2.password).toBe('$2b$10$hashed2');
    });
    
    it('should not hash password if not provided', async () => {
      // Arrange
      const mockUser = {
        username: 'nopassword',
      } as unknown as User;

      const mockInsertEvent = {
        entity: mockUser,
        manager: {} as any,
        queryRunner: {} as any,
      } as InsertEvent<User>;

      // Act
      await userSubscriber.beforeInsert(mockInsertEvent);

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'BEFORE USER INSERTED: ',
        mockUser,
      );
      expect(BcryptUtil.hashPassword).not.toHaveBeenCalled();
    });
  });
});
