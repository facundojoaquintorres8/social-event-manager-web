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
        const translated = translate.instant(`errors.${error.error.message}`);
        const message = translated.startsWith('errors.') ? error.error.message : translated;
        toastService.show(message, 'error');
      } else if (error.status >= 500) {
        toastService.show(translate.instant('errors.serverError'), 'error');
      } else {
        toastService.show(translate.instant('errors.unexpectedError'), 'error');
      }

      return throwError(() => error);
    }),
  );
};
