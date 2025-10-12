import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import { Role } from '../../../core/common/enums/role.enum';
import { hasRolePermission, ERROR_MESSAGES } from '../../../core/common/constants';

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
  const user = context.req?.user || context.extra?.user || context.user;
  const userRole: Role = user?.role ?? Role.USER;

  // Check if user has sufficient permissions
  if (!hasRolePermission(userRole, requiredRole)) {
    throw new ForbiddenException(
      `${ERROR_MESSAGES.GRAPHQL.INSUFFICIENT_PERMISSIONS}. Required role: ${requiredRole}`,
    );
  }

  return next();
};
