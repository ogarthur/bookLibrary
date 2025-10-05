import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoggerService, NotificationService } from '@core/services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
        logger.error('Client-side error:', errorMessage);
      } else {
        // Server-side error
        errorMessage = error.error?.message || `Server Error: ${error.status} ${error.statusText}`;
        logger.error(`HTTP Error ${error.status}:`, {
          url: error.url,
          message: error.message,
          error: error.error,
        });
      }

      // Show notification to user
      notification.showError(errorMessage);
      return throwError(() => error);
    }),
  );
};
