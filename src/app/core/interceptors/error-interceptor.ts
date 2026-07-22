import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { TranslateService } from '@ngx-translate/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const translate = inject(TranslateService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        toastService.show(translate.instant('errors.connectionError'), 'error');
      } else if (error.error?.message) {
        toastService.show(error.error.message, 'error');
      } else if (error.status >= 500) {
        toastService.show(translate.instant('errors.serverError'), 'error');
      } else {
        toastService.show(translate.instant('errors.unexpectedError'), 'error');
      }

      return throwError(() => error);
    }),
  );
};
