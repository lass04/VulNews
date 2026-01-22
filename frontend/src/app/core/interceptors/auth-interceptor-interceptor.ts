import { AuthService } from './../services/auth/auth-service';
import { inject } from '@angular/core';
import { catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {

  const auth: AuthService = inject(AuthService);
  const token = auth.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return handle401(authReq, next, auth);
      }
      return throwError(() => err);
    })
  );
};

/* ---------------- HELPERS ---------------- */

const handle401 = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  auth: AuthService
): Observable<HttpEvent<unknown>> => {

  if (!auth.isRefreshing) {
    auth.isRefreshing = true;

    return auth.refresh().pipe(
      switchMap(res => {
        auth.isRefreshing = false;
        return next(req.clone({ setHeaders: { Authorization: `Bearer ${res.accessToken}` } }));
      }),
      catchError(err => {
        auth.isRefreshing = false;
        auth.logout();
        return throwError(() => err);
      })
    );
  }

  // Wait for token$ if refresh is already in progress
  return auth.token$.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(token => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })))
  );
};

