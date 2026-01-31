import { Router } from '@angular/router';
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { AuthService } from './../services/auth/auth-service';
import { inject } from '@angular/core';
import { catchError, throwError, BehaviorSubject, switchMap, filter, take, Observable } from 'rxjs';


let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {

   const EXCLUDED_ROUTES = [
    '/auth/login',
    '/auth/register'
  ];

  if (EXCLUDED_ROUTES.some(url => req.url.includes(url))) {
    return next(req);
  }

  const router = inject(Router);
  const auth = inject(AuthService);
  const token = auth.getToken();
  
  const reqClone = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    },
    withCredentials: true
  });


  return next(reqClone).pipe(
    
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401 ) {
        console.log("Token Expired");
        
        return handle401(reqClone, next, auth, router);
        
      }
      
      return throwError(() => error);
    })
  );

};

function handle401(
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn, 
  auth: AuthService, 
  router: Router
): Observable<HttpEvent<unknown>> {
  
  if (!isRefreshing) {
    
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return auth.refresh().pipe(
      switchMap(() => {
        isRefreshing = false;
        
        console.log("Interceptor 401...");
        const newToken = auth.getToken();
        refreshTokenSubject.next(newToken);

        
        const newReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken}`
          },
          withCredentials: true
        });
        
        return next(newReq);
      }),
      catchError((error) => {
        isRefreshing = false;
        auth.logout();
        router.navigate(['/']);
        return throwError(() => error);
      })
    );
    
  } else {
    
    return refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap((token) => {
        
        const newReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        return next(newReq);
      })
    );
  }
}