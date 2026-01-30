import { ApplicationConfig, provideAppInitializer, inject, PLATFORM_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '@pckg/auth';
import { environment } from '../environments/environment';

const authConfig = {
  url: environment.authUrl,
  realm: 'FADS',
  clientId: 'angular-app',
};

const initializeAuth = async () => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);

  if (isPlatformBrowser(platformId)) {
    // Wir returnen das Promise, damit Angular wartet,
    // aber wir fangen ALLES ab, damit die App auf jeden Fall startet.
    return authService
      .init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        pkceMethod: 'S256',
        checkLoginIframe: false,
      })
      .catch((err) => {
        console.error('Keycloak Init Error - App startet trotzdem:', err);
        return false;
      });
  }
  // Auf dem Server sofort auflösen
  return Promise.resolve();
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: AuthService,
      // WICHTIG: Kein statischer Aufruf außerhalb, sondern hier drin
      useFactory: () => AuthService.getInstance(authConfig),
    },
    provideAppInitializer(initializeAuth),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideClientHydration(withEventReplay()),
  ],
};
