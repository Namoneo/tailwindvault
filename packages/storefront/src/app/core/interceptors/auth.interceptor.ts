import { HttpInterceptorFn } from '@angular/common/http';
import { readStoredAuthState } from '../services/auth.storage';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const { token } = readStoredAuthState();

  if (!token || request.url.includes('/auth/login') || request.url.includes('/auth/register')) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};
