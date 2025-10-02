import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

const mockUsersService = {
  findByUsername: jest.fn(),
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
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
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
        password: 'admin123',
        isActive: true,
        cats: [],
      };
      mockUsersService.findByUsername.mockResolvedValue(user);

      const result = await authService.validateUser('admin', 'admin123');

      expect(result).toBeDefined();
      expect(result.username).toBe('admin');
      expect(result).not.toHaveProperty('password');
    });

    it('should return null when credentials are invalid', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);
      const result = await authService.validateUser('invalid', 'invalid');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user when credentials are valid', async () => {
      const user: Omit<User, 'password'> = {
        id: 1,
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        isActive: true,
        cats: [],
      };
      // We can mock validateUser directly if we want to isolate the test to only the login method
      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);

      const result = await authService.login('admin', 'admin123');

      expect(result).toBeDefined();
      expect(result!.access_token).toBe('fake-jwt-token');
      expect(result!.user.username).toBe('admin');
    });

    it('should return null when credentials are invalid', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);
      const result = await authService.login('invalid', 'invalid');
      expect(result).toBeNull();
    });
  });
});