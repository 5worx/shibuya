import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '@shibuya/auth';
import { environment } from '../environments/environment';

const authConfig = {
  url: environment.authUrl,
  realm: 'FADS',
  clientId: 'angular-app',
};

const isBrowser = typeof window !== 'undefined';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(() => {
      const authService = AuthService.getInstance(authConfig);
      if (isBrowser) {
        return authService.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
          pkceMethod: 'S256',
        });
      }
      return Promise.resolve();
    }),

    // Den Service für Injection bereitstellen
    {
      provide: AuthService,
      useFactory: () => AuthService.getInstance(),
    },
    provideHttpClient(withInterceptors([authInterceptor])),
    provideClientHydration(withEventReplay()),
  ],
};
