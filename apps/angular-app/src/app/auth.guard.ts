import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { AuthService } from '@shibuya/auth';

export const authGuard = () => {
  const platformId = inject(PLATFORM_ID);

  // Wenn wir auf dem Server/beim Build sind, lassen wir die Route durch,
  // damit das Rendering nicht abbricht.
  if (isPlatformServer(platformId)) {
    return true;
  }

  // Hier kommt deine normale Logik für den Browser
  const authService = inject(AuthService);
  return authService.isLoggedIn() || authService.login();
};
