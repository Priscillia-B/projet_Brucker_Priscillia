import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../store/auth/auth.state';

export const authGuard: CanMatchFn = (_route, segments) => {
  const store = inject(Store);
  const router = inject(Router);

  if (store.selectSnapshot(AuthState.isAuthenticated)) return true;

  const returnUrl = '/' + segments.map(s => s.path).join('/');
  return router.createUrlTree(['/login'], { queryParams: { returnUrl } });
};

export const guestGuard: CanMatchFn = () => {
  if (!inject(Store).selectSnapshot(AuthState.isAuthenticated)) return true;
  return inject(Router).createUrlTree(['/pollutions']);
};
