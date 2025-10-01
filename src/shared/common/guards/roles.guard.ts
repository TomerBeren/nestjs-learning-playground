
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('=== RolesGuard ===');
    
    const roles = this.reflector.get(Roles, context.getHandler());
    console.log('Required roles from @Roles decorator:', roles);
    
    if (!roles) {
      console.log('No roles required, allowing access');
      return true;
    }

    const request = context.switchToHttp().getRequest();
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);

    // Mock user data for testing (simulate authenticated user)
    const mockUser = {
      name: 'Test User',
      roles: ['user', 'admin'] // Mock roles - try changing these to test
    };
    
    // Attach mock user to request (simulating authentication middleware)
    request.user = mockUser;
    console.log('Mock user attached:', mockUser);

    const user = request.user;
    console.log('User roles:', user?.roles);
    
    const hasAccess = matchRoles(roles, user?.roles);
    console.log('Access granted:', hasAccess);
    
    return hasAccess;
  }
}

function matchRoles(requiredRoles: string[], userRoles: string[]): boolean {
  if (!userRoles) return false;
  return requiredRoles.some(role => userRoles.includes(role));
}
