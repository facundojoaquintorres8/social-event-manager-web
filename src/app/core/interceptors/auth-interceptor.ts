import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.accessToken();

  const isAuthRequest = req.url.includes('/auth');

  if (!token || isAuthRequest) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      return authService.refresh().pipe(
        switchMap((res) => {
          authService.storeUserAndTokens(res.data);

          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${res.data.accessToken}`,
            },
          });

          return next(retryReq);
        }),
        catchError(() => {
          authService.logout();
          return throwError(() => error);
        }),
      );
    }),
  );
};
