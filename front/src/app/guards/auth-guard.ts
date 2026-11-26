import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanMatchFn = (_route, segments) => {
  if (inject(AuthService).isLoggedIn()) return true;
  const returnUrl = '/' + segments.map(s => s.path).join('/');
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl } });
};

export const guestGuard: CanMatchFn = () => {
  if (!inject(AuthService).isLoggedIn()) return true;
  return inject(Router).createUrlTree(['/pollutions']);
};
