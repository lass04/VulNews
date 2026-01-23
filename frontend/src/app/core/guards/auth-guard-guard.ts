import { AuthService } from './../services/auth/auth-service';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {

    const auth = inject(AuthService);

    if(!auth.isTokenExpired())
        return true;
    return false;

};
