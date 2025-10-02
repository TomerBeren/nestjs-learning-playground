import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    console.log('=== TimeoutInterceptor ===');
    console.log(`Starting timeout for: ${request.method} ${request.url}`);
    console.log('Timeout set to: 5000ms');

    return next.handle().pipe(
      timeout(5000),
      catchError(err => {
        console.log('TimeoutInterceptor caught error:', err.constructor.name);
        
        if (err instanceof TimeoutError) {
          console.log('REQUEST TIMED OUT! Converting to RequestTimeoutException');
          return throwError(() => new RequestTimeoutException());
        }
        
        console.log('Non-timeout error, passing through:', err.message);
        return throwError(() => err);
      }),
    );
  };
};