import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { BcryptUtil } from '../../core/common/utils/bcrypt.util';
import { JwtService } from '@nestjs/jwt';

// Mock BcryptUtil
jest.mock('../../core/common/utils/bcrypt.util');

const mockUsersService = {
  findByUsername: jest.fn(),
  findOne: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const user: User = {
        id: 1,
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        password: '$2b$10$hashedPassword',
        isActive: true,
        cats: [],
      };
      mockUsersService.findByUsername.mockResolvedValue(user);
      (BcryptUtil.comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('admin', 'admin123');

      expect(result).toBeDefined();
      expect(result.username).toBe('admin');
      expect(result).not.toHaveProperty('password');
      expect(BcryptUtil.comparePassword).toHaveBeenCalledWith('admin123', '$2b$10$hashedPassword');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);
      
      await expect(authService.validateUser('invalid', 'invalid')).rejects.toThrow(
        UnauthorizedException,
      );
    });
    
    it('should throw UnauthorizedException when password is invalid', async () => {
      const user: User = {
        id: 1,
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        password: '$2b$10$hashedPassword',
        isActive: true,
        cats: [],
      };
      mockUsersService.findByUsername.mockResolvedValue(user);
      (BcryptUtil.comparePassword as jest.Mock).mockResolvedValue(false);
      
      await expect(authService.validateUser('admin', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(BcryptUtil.comparePassword).toHaveBeenCalledWith('wrongpassword', '$2b$10$hashedPassword');
    });
  });

  describe('login', () => {
    it('should return access token when credentials are valid', async () => {
      const user: Omit<User, 'password'> = {
        id: 1,
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        isActive: true,
        cats: [],
      };
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
      
      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue(mockToken);

      const result = await authService.login('admin', 'admin123');

      expect(result).toBeDefined();
      expect(result!.access_token).toBe(mockToken);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        username: 'admin',
      });
    });

    it('should return null when credentials are invalid', async () => {
      jest.spyOn(authService, 'validateUser').mockRejectedValue(new UnauthorizedException());
      const result = await authService.login('invalid', 'invalid');
      expect(result).toBeNull();
    });
  });

  describe('getUserByToken', () => {
    it('should return user when token is valid', async () => {
      const user: User = {
        id: 1,
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        password: '$2b$10$hashedPassword',
        isActive: true,
        cats: [],
      };
      const mockPayload = { sub: 1, username: 'admin' };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockUsersService.findOne.mockResolvedValue(user);

      const result = await authService.getUserByToken('valid.jwt.token');

      expect(result).toBeDefined();
      expect(result.username).toBe('admin');
      expect(result).not.toHaveProperty('password');
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid.jwt.token');
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return null when token is invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      const result = await authService.getUserByToken('invalid.token');

      expect(result).toBeNull();
    });

    it('should return null when user not found', async () => {
      const mockPayload = { sub: 999, username: 'nonexistent' };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockUsersService.findOne.mockResolvedValue(null);

      const result = await authService.getUserByToken('valid.jwt.token');

      expect(result).toBeNull();
    });
  });
});