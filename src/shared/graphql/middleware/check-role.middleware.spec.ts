import { checkRoleMiddleware } from './check-role.middleware';
import { ForbiddenException } from '@nestjs/common';
import { Role } from '../../../core/common/enums/role.enum';

describe('checkRoleMiddleware', () => {
  let mockNext: jest.Mock;
  let mockContext: any;

  beforeEach(() => {
    mockNext = jest.fn().mockResolvedValue('field value');
    mockContext = {
      info: {
        fieldName: 'sensitiveField',
        parentType: {
          getFields: jest.fn().mockReturnValue({
            sensitiveField: {
              extensions: {},
            },
          }),
        },
      },
      context: {},
    };
  });

  describe('when no role is required', () => {
    it('should allow access to fields without role extension', async () => {
      mockContext.info.parentType.getFields.mockReturnValue({
        sensitiveField: {
          extensions: {}, // No role specified
        },
      });

      const result = await checkRoleMiddleware(mockContext, mockNext);

      expect(result).toBe('field value');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when role is required', () => {
    it('should allow access when user has exact required role', async () => {
      mockContext.info.parentType.getFields.mockReturnValue({
        sensitiveField: {
          extensions: { role: Role.USER },
        },
      });
      mockContext.context = {
        user: { role: Role.USER },
      };

      const result = await checkRoleMiddleware(mockContext, mockNext);

      expect(result).toBe('field value');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow access when user has higher role (ADMIN accessing USER field)', async () => {
      mockContext.info.parentType.getFields.mockReturnValue({
        sensitiveField: {
          extensions: { role: Role.USER },
        },
      });
      mockContext.context = {
        user: { role: Role.ADMIN },
      };

      const result = await checkRoleMiddleware(mockContext, mockNext);

      expect(result).toBe('field value');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow access when MODERATOR accesses USER field', async () => {
      mockContext.info.parentType.getFields.mockReturnValue({
        sensitiveField: {
          extensions: { role: Role.USER },
        },
      });
      mockContext.context = {
        user: { role: Role.MODERATOR },
      };

      const result = await checkRoleMiddleware(mockContext, mockNext);

      expect(result).toBe('field value');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should deny access when user has lower role (USER accessing ADMIN field)', async () => {
      mockContext.info.parentType.getFields.mockReturnValue({
        sensitiveField: {
          extensions: { role: Role.ADMIN },
        },
      });
      mockContext.context = {
        user: { role: Role.USER },
      };

      await expect(checkRoleMiddleware(mockContext, mockNext)).rejects.toThrow(
        ForbiddenException
      );
      await expect(checkRoleMiddleware(mockContext, mockNext)).rejects.toThrow(
        'Insufficient permissions to access "sensitiveField" field. Required role: ADMIN'
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access when USER accesses MODERATOR field', async () => {
      mockContext.info.parentType.getFields.mockReturnValue({
        sensitiveField: {
          extensions: { role: Role.MODERATOR },
        },
      });
      mockContext.context = {
        user: { role: Role.USER },
      };

      await expect(checkRoleMiddleware(mockContext, mockNext)).rejects.toThrow(
        ForbiddenException
      );
      await expect(checkRoleMiddleware(mockContext, mockNext)).rejects.toThrow(
        'Insufficient permissions to access "sensitiveField" field. Required role: MODERATOR'
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access when MODERATOR accesses ADMIN field', async () => {
      mockContext.info.parentType.getFields.mockReturnValue({
        sensitiveField: {
          extensions: { role: Role.ADMIN },
        },
      });
      mockContext.context = {
        user: { role: Role.MODERATOR },
      };

      await expect(checkRoleMiddleware(mockContext, mockNext)).rejects.toThrow(
        ForbiddenException
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should default to USER role when user has no role', async () => {
      mockContext.info.parentType.getFields.mockReturnValue({
        sensitiveField: {
          extensions: { role: Role.USER },
        },
      });
      mockContext.context = {
        user: { id: 1 }, // User exists but no role
      };

      const result = await checkRoleMiddleware(mockContext, mockNext);

      expect(result).toBe('field value');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should default to USER role when no user in context', async () => {
      mockContext.info.parentType.getFields.mockReturnValue({
        sensitiveField: {
          extensions: { role: Role.USER },
        },
      });
      mockContext.context = {}; // No user

      const result = await checkRoleMiddleware(mockContext, mockNext);

      expect(result).toBe('field value');
      expect(mockNext).toHaveBeenCalled();
    });

    it('should deny access to ADMIN field when no user in context', async () => {
      mockContext.info.parentType.getFields.mockReturnValue({
        sensitiveField: {
          extensions: { role: Role.ADMIN },
        },
      });
      mockContext.context = {}; // No user

      await expect(checkRoleMiddleware(mockContext, mockNext)).rejects.toThrow(
        ForbiddenException
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('role hierarchy', () => {
    it('should respect role hierarchy: ADMIN > MODERATOR > USER', async () => {
      // Test ADMIN can access everything
      for (const requiredRole of [Role.USER, Role.MODERATOR, Role.ADMIN]) {
        mockContext.info.parentType.getFields.mockReturnValue({
          sensitiveField: {
            extensions: { role: requiredRole },
          },
        });
        mockContext.context = {
          user: { role: Role.ADMIN },
        };

        const result = await checkRoleMiddleware(mockContext, mockNext);
        expect(result).toBe('field value');
      }
    });

    it('should respect role hierarchy: MODERATOR can access USER and MODERATOR', async () => {
      // Can access USER fields
      mockContext.info.parentType.getFields.mockReturnValue({
        sensitiveField: {
          extensions: { role: Role.USER },
        },
      });
      mockContext.context = {
        user: { role: Role.MODERATOR },
      };

      let result = await checkRoleMiddleware(mockContext, mockNext);
      expect(result).toBe('field value');

      // Can access MODERATOR fields
      mockContext.info.parentType.getFields.mockReturnValue({
        sensitiveField: {
          extensions: { role: Role.MODERATOR },
        },
      });

      result = await checkRoleMiddleware(mockContext, mockNext);
      expect(result).toBe('field value');
    });
  });
});
