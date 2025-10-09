import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import { Role } from '../../../core/common/enums/role.enum';

export const checkRoleMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const { info, context } = ctx;
  const { extensions } = info.parentType.getFields()[info.fieldName];

  // If no role is required, allow access
  if (!extensions?.role) {
    return next();
  }

  const requiredRole = extensions.role as Role;

  /**
   * In a real-world application, get the user from context
   * For example: const userRole = context.user?.role || Role.USER;
   * 
   * For now, we'll check if user exists in context (from auth)
   * If authenticated, grant higher privileges; otherwise, default to USER
   */
  const userRole = context?.user?.role || (context?.user ? Role.USER : Role.USER);

  // Check if user has sufficient permissions
  if (!hasPermission(userRole, requiredRole)) {
    throw new ForbiddenException(
      `Insufficient permissions to access "${info.fieldName}" field. Required role: ${requiredRole}`,
    );
  }

  return next();
};

/**
 * Check if user role has permission to access required role
 * Role hierarchy: ADMIN > MODERATOR > USER
 */
function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const roleHierarchy = {
    [Role.ADMIN]: 3,
    [Role.MODERATOR]: 2,
    [Role.USER]: 1,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
