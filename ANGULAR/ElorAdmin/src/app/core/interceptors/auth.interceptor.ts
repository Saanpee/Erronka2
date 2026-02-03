import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // auth tokena lortu
  const token = authService.getToken();

  // tokena badago eskaria klonatu eta header gehitu
  let authReq = req;
  if (token && req.url.includes('localhost:3000')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } 

  // eskaria bidali eta erroreak kudeatu
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('Saioa iraungi da edo tokena baliogabea');
        authService.logout();
        router.navigate(['/login'], {
          queryParams: { sessionExpired: 'true' }
        });
      }
      if (error.status === 403) {
        console.warn('Ez dago baimenik baliabide honetarako');
        router.navigate(['/dashboard']);
      }

      return throwError(() => error);
    })
  );
};
