import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@shibuya/auth';

const TOKEN_ENDPOINT = '/protocol/openid-connect/token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Wenn Request an den Token-Endpoint oder an Keycloak generell geht, nichts tun
  if (req.url.includes(TOKEN_ENDPOINT) || req.url.includes('/realms/')) {
    return next(req);
  }

  const token = authService.getToken();

  // Token nur an eigene APIs hängen (z.B. localhost)
  if (token && req.url.includes('localhost')) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
