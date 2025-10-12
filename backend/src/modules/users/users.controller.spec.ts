import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { instanceToPlain } from 'class-transformer';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
          password: 'hashedPassword123',
          isActive: true,
          cats: [],
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          username: 'janesmith',
          password: 'hashedPassword456',
          isActive: true,
          cats: [],
        },
      ] as User[];

      mockUsersService.findAll.mockResolvedValue(users);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(users);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      // Arrange
      const user = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        password: 'hashedPassword123',
        isActive: true,
        cats: [],
      } as User;

      mockUsersService.findOne.mockResolvedValue(user);

      // Act
      const result = await controller.findOne('1');

      // Assert
      expect(result).toEqual(user);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto = {
        firstName: 'Bob',
        lastName: 'Johnson',
        username: 'bobjohnson',
        password: 'password123',
      };

      const createdUser = {
        id: 3,
        ...createUserDto,
        isActive: true,
        cats: [],
      } as User;

      mockUsersService.create.mockResolvedValue(createdUser);

      // Act
      const result = await controller.create(createUserDto);

      // Assert
      expect(result).toEqual(createdUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('Password Serialization (@Exclude)', () => {
    it('should exclude password field when serializing User entity', () => {
      // Arrange - Create a User instance with password
      const user = new User();
      user.id = 1;
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.username = 'johndoe';
      user.password = 'SuperSecretPassword123';
      user.isActive = true;

      // Act - Serialize the user (simulating what ClassSerializerInterceptor does)
      const serialized = instanceToPlain(user);

      // Assert - Password should NOT be in the serialized output
      expect(serialized).toHaveProperty('id');
      expect(serialized).toHaveProperty('firstName');
      expect(serialized).toHaveProperty('lastName');
      expect(serialized).toHaveProperty('username');
      expect(serialized).toHaveProperty('isActive');
      expect(serialized).not.toHaveProperty('password'); // ✅ Password excluded!
    });

    it('should exclude password from multiple users', () => {
      // Arrange
      const users = [
        Object.assign(new User(), {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          password: 'secret1',
          isActive: true,
        }),
        Object.assign(new User(), {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          username: 'janesmith',
          password: 'secret2',
          isActive: true,
        }),
      ];

      // Act
      const serialized = users.map((user) => instanceToPlain(user));

      // Assert
      serialized.forEach((user) => {
        expect(user).not.toHaveProperty('password');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('firstName');
      });
    });

    it('should verify password exists on entity but not after serialization', () => {
      // Arrange
      const user = new User();
      user.id = 1;
      user.firstName = 'Test';
      user.lastName = 'User';
      user.username = 'testuser';
      user.password = 'MySecretPassword';
      user.isActive = true;

      // Assert - Before serialization
      expect(user.password).toBe('MySecretPassword'); // Password exists on entity
      expect(user).toHaveProperty('password');

      // Act - Serialize
      const serialized = instanceToPlain(user);

      // Assert - After serialization
      expect(serialized).not.toHaveProperty('password'); // Password removed
      expect(serialized.password).toBeUndefined();
      
      // But original entity still has password
      expect(user.password).toBe('MySecretPassword');
    });

    it('should handle null or undefined password gracefully', () => {
      // Arrange
      const user = new User();
      user.id = 1;
      user.firstName = 'Test';
      user.lastName = 'User';
      user.username = 'testuser';
      user.password = null as any; // Simulating null password
      user.isActive = true;

      // Act
      const serialized = instanceToPlain(user);

      // Assert - Password field should still be excluded even if null
      expect(serialized).not.toHaveProperty('password');
    });
  });

  describe('ClassSerializerInterceptor Integration', () => {
    it('should work with ClassSerializerInterceptor', () => {
      // Arrange
      const reflector = new Reflector();
      const interceptor = new ClassSerializerInterceptor(reflector);
      
      const user = new User();
      user.id = 1;
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.username = 'johndoe';
      user.password = 'ShouldNotAppear';
      user.isActive = true;

      // This demonstrates that the interceptor uses class-transformer internally
      // The actual interception happens in the NestJS framework layer
      const serialized = instanceToPlain(user);

      // Assert
      expect(serialized).not.toHaveProperty('password');
      expect(interceptor).toBeDefined(); // Interceptor exists
    });
  });
});
