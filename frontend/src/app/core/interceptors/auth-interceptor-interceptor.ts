import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './../services/auth/auth-service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';



export const authInterceptor: HttpInterceptorFn = (req,next) => {

  const auth = inject(AuthService);


    const token = auth.getToken();
    
    
      const reqClone = req.clone({
        setHeaders: {
          Authorization : `Bearer ${token}`
      },
       withCredentials : true 
    });

      return next(reqClone).pipe(
        catchError((error:HttpErrorResponse)=>{
          if(error.status === 401){
            auth.$refreshToken.next(true);
          }
          return throwError(error);
        })
      )
      
    }


