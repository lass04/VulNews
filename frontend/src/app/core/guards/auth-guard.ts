import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';

export const authChildGuard: CanActivateChildFn = (route, state) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isTokenExpired()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
  
};

