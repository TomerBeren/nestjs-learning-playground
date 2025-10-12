import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for valid token', async () => {
      const mockPayload = { sub: 1, username: 'john' };
      const mockRequest = {
        headers: {
          authorization: 'Bearer validtoken123',
        },
      };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockRequest['user']).toEqual(mockPayload);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('validtoken123');
    });

    it('should throw UnauthorizedException when no token provided', async () => {
      const mockRequest = {
        headers: {},
      };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalidtoken',
        },
      };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when authorization header format is wrong', async () => {
      const mockRequest = {
        headers: {
          authorization: 'InvalidFormat token123',
        },
      };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should extract token correctly from Bearer header', async () => {
      const mockPayload = { sub: 1, username: 'test' };
      const token = 'mytoken123';
      const mockRequest = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

      await guard.canActivate(mockContext);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token);
    });
  });
});
