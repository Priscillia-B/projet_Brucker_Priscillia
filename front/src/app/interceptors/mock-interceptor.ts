import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { delay, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pollution } from '../models/pollution';
import { SignupResponse } from '../models/user';
import { MOCK_POLLUTIONS } from './mock-data';

// "Base de données" en mémoire 
let pollutions: Pollution[] = [...MOCK_POLLUTIONS];
let nextUserId = 1;


export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMock || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const [resource, param] = req.url.slice(environment.apiUrl.length).split('/').filter(Boolean);

  if (resource === 'pollutions') {
    return handlePollutions(req, param ? Number(param) : null);
  }
  if (resource === 'auth' && param === 'signup' && req.method === 'POST') {
    const response: SignupResponse = { id: nextUserId++, message: 'Compte créé avec succès' };
    return ok(response, 201);
  }
  return notFound(req);
};


function handlePollutions(req: HttpRequest<unknown>, id: number | null) {
  const existing = pollutions.find(p => p.id === id);

  switch (req.method) {
    case 'GET':
      if (id === null) return ok(pollutions);
      return existing ? ok(existing) : notFound(req);

    case 'POST': {
      const nextId = Math.max(0, ...pollutions.map(p => p.id ?? 0)) + 1;
      const created: Pollution = { ...(req.body as Pollution), id: nextId };
      pollutions = [...pollutions, created];
      return ok(created, 201);
    }

    case 'PUT': {
      if (!existing) return notFound(req);
      const updated: Pollution = { ...(req.body as Pollution), id: existing.id };
      pollutions = pollutions.map(p => (p.id === id ? updated : p));
      return ok(updated);
    }

    case 'DELETE':
      if (!existing) return notFound(req);
      pollutions = pollutions.filter(p => p.id !== id);
      return ok(null, 204);

    default:
      return notFound(req);
  }
}

function ok(body: unknown, status = 200) {
  return of(new HttpResponse({ status, body })).pipe(delay(300));
}

function notFound(req: HttpRequest<unknown>) {
  return throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found', url: req.url }));
}
