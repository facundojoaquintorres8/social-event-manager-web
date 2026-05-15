import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        toastService.show('Unable to connect to server', 'error');
      } else if (error.error?.message) {
        toastService.show(error.error.message, 'error');
      } else if (error.status >= 500) {
        toastService.show('Internal server error', 'error');
      } else {
        toastService.show('Unexpected error occurred', 'error');
      }

      return throwError(() => error);
    }),
  );
};
