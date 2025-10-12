import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}

function validateRequest(request: any): boolean {
  // TODO: Implement your authentication logic here
  // For now, returning true to allow all requests
  console.log('AuthGuard: Validating request for:', request.url);
  return true;
}