import { inject } from '@angular/core';
import { AuthService } from '@pckg/auth';

/**
 * Klassischer Showcase AuthGuard für SHIBUYA.
 * Da wir nun im reinen Browser-Modus (SPA) arbeiten, entfällt die SSR-Logik.
 */
export const authGuard = () => {
  const authService = inject(AuthService);

  // 1. Falls der User eingeloggt ist, darf er die Route passieren.
  if (authService.isLoggedIn()) {
    return true;
  }

  // 2. Falls nicht eingeloggt, leiten wir sofort zu Keycloak weiter.
  // Ohne SSR gibt es kein "Flickering" von Server-Inhalten.
  console.log('AuthGuard: Redirecting to Keycloak login...');

  authService.login().catch((err) => {
    console.error('AuthGuard: Login redirect failed', err);
  });

  // Navigation blockieren, während der Redirect läuft.
  return false;
};
