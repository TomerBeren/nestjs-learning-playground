import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService();
    authService = new AuthService(usersService);
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', () => {
      const result = authService.validateUser('admin', 'admin123');
      
      expect(result).toBeDefined();
      expect(result!.username).toBe('admin');
      expect(result).not.toHaveProperty('password');
    });

    it('should return null when credentials are invalid', () => {
      const result = authService.validateUser('invalid', 'invalid');
      
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user when credentials are valid', () => {
      const result = authService.login('admin', 'admin123');
      
      expect(result).toBeDefined();
      expect(result!.access_token).toBe('fake-jwt-token');
      expect(result!.user.username).toBe('admin');
    });

    it('should return null when credentials are invalid', () => {
      const result = authService.login('invalid', 'invalid');
      
      expect(result).toBeNull();
    });
  });
});