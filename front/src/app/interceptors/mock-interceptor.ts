import { HttpInterceptorFn } from '@angular/common/http';
import { delay } from 'rxjs';
import { environment } from '../../environments/environment';

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMock || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }
  const mocked = req.clone({ method: 'GET', url: `${req.url}.json`, body: null });
  return next(mocked).pipe(delay(500)); 
};