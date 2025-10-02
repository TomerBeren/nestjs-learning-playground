import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      validateUser: jest.fn(),
      getUserByToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return login result when credentials are valid', async () => {
      const loginDto = { username: 'admin', password: 'admin123' };
      const mockResult = { 
        access_token: 'fake-jwt-token', 
        user: { 
          id: 1,
          name: 'Admin User',
          email: 'admin@test.com',
          username: 'admin',
          roles: ['admin']
        } 
      };
      
      jest.spyOn(authService, 'login').mockResolvedValue(mockResult);

      const result = await controller.login(loginDto);
      expect(result).toBe(mockResult);
      expect(authService.login).toHaveBeenCalledWith('admin', 'admin123');
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto = { username: 'invalid', password: 'invalid' };
      
      jest.spyOn(authService, 'login').mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});