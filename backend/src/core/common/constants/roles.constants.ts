import { Role } from '../enums/role.enum';

/**
 * Role hierarchy configuration
 * Higher values indicate more permissions
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.ADMIN]: 3,
  [Role.MODERATOR]: 2,
  [Role.USER]: 1,
} as const;

/**
 * Helper function to check if a user role has sufficient permissions
 */
export function hasRolePermission(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
