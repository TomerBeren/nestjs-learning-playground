import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersService', () => {
  let service: UsersService; // ← The thing we're testing
  let repository: Repository<User>;
  let dataSource: DataSource;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService); // ← Get the service instance
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    dataSource = module.get<DataSource>(DataSource);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: 'password123',
      };

      const savedUser = {
        id: 1,
        ...createUserDto,
        isActive: true,
        cats: [],
      } as User;

      mockRepository.create.mockReturnValue(savedUser);
      mockRepository.save.mockResolvedValue(savedUser);

      // Act
      const result = await service.create(createUserDto); // ← Using service

      // Assert
      expect(result).toEqual(savedUser);
      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(savedUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Arrange
      const users = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          password: 'pass1',
          isActive: true,
          cats: [],
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          username: 'janesmith',
          password: 'pass2',
          isActive: true,
          cats: [],
        },
      ] as User[];

      mockRepository.find.mockResolvedValue(users);

      // Act
      const result = await service.findAll(); // ← Using service

      // Assert
      expect(result).toEqual(users);
      expect(result).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should return an empty array when no users exist', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.findAll(); // ← Using service

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      // Arrange
      const user = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: 'password123',
        isActive: true,
        cats: [],
      } as User;

      mockRepository.findOneBy.mockResolvedValue(user);

      // Act
      const result = await service.findOne(1); // ← Using service

      // Assert
      expect(result).toEqual(user);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      mockRepository.findOneBy.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('User #999 not found');
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      // Arrange
      const user = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: 'password123',
        isActive: true,
        cats: [],
      } as User;

      mockRepository.findOne.mockResolvedValue(user);

      // Act
      const result = await service.findByUsername('johndoe'); // ← Using service

      // Assert
      expect(result).toEqual(user);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'johndoe' },
      });
    });

    it('should return undefined when user is not found', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findByUsername('nonexistent'); // ← Using service

      // Assert
      expect(result).toBeUndefined();
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'nonexistent' },
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      // Arrange
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Updated',
      };

      const preloadedUser = {
        id: 1,
        firstName: 'Jane',
        lastName: 'Updated',
        username: 'johndoe',
        password: 'password123',
        isActive: true,
        cats: [],
      } as User;

      const savedUser = { ...preloadedUser };

      mockRepository.preload.mockResolvedValue(preloadedUser);
      mockRepository.save.mockResolvedValue(savedUser);

      // Act
      const result = await service.update(1, updateUserDto); // ← Using service

      // Assert
      expect(result).toEqual(savedUser);
      expect(mockRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateUserDto,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(preloadedUser);
    });

    it('should throw NotFoundException when user to update is not found', async () => {
      // Arrange
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
      };

      mockRepository.preload.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(999, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(999, updateUserDto)).rejects.toThrow(
        'User #999 not found',
      );
      expect(mockRepository.preload).toHaveBeenCalledWith({
        id: 999,
        ...updateUserDto,
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      // Arrange
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      // Act
      await service.remove(1); // ← Using service

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user to delete is not found', async () => {
      // Arrange
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow('User #999 not found');
      expect(mockRepository.delete).toHaveBeenCalledWith(999);
    });
  });

  describe('createMany', () => {
    it('should create multiple users in a transaction', async () => {
      // Arrange
      const users = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          password: 'pass1',
          isActive: true,
          cats: [],
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          username: 'janesmith',
          password: 'pass2',
          isActive: true,
          cats: [],
        },
      ] as User[];

      const mockManager = {
        save: jest.fn().mockResolvedValue({}),
      };

      mockDataSource.transaction.mockImplementation(
        async (callback: Function) => {
          return callback(mockManager);
        },
      );

      // Act
      await service.createMany(users); // ← Using service

      // Assert
      expect(mockDataSource.transaction).toHaveBeenCalled();
      expect(mockManager.save).toHaveBeenCalledTimes(2);
      expect(mockManager.save).toHaveBeenNthCalledWith(1, users[0]);
      expect(mockManager.save).toHaveBeenNthCalledWith(2, users[1]);
    });
  });
});
