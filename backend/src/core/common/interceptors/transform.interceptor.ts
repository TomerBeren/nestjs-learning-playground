import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Transform Interceptor
 * - Wraps primitive responses (string, number, boolean) in { data: value }
 * - Leaves objects and arrays untouched (unless already wrapped)
 * - Ensures all responses are valid JSON
 * - Prevents double-wrapping by checking for existing 'data' property
 */
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // If already wrapped with { data: ... }, return as-is to prevent double wrapping
        if (data && typeof data === 'object' && 'data' in data && Object.keys(data).length === 1) {
          return data;
        }
        
        // If response is an object or array (but NOT already wrapped), return as-is
        if (typeof data === 'object' && data !== null) {
          return data;
        }
        
        // If it's a primitive (string, number, boolean), wrap it in { data }
        if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
          return { data };
        }
        
        // For undefined/null, return empty object
        return data ?? {};
      })
    );
  }
}
