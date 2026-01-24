import { Component, inject, computed } from '@angular/core';
import { AuthService } from '@shibuya/auth';

@Component({
  selector: 'app-protected-page',
  standalone: true,
  templateUrl: './protected.html',
})
export class ProtectedPage {
  private auth = inject(AuthService);

  // Wir nutzen Signale oder Computeds für reaktive Daten
  user = computed(() => this.auth.getUser());

  stringified = computed(() => {
    const userData = this.user();
    return userData ? JSON.stringify(userData, null, 2) : '';
  });

  logout() {
    this.auth.logout();
  }
}
