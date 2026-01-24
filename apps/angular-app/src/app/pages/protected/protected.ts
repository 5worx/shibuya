import { Component, inject } from '@angular/core';
import { AuthService } from '@shibuya/auth';

@Component({
  selector: 'app-protected-page',
  standalone: true,
  templateUrl: './protected.html',
})
export class ProtectedPage {
  private auth = inject(AuthService);
  user = () => this.auth.getUser();

  stringified = JSON.stringify(this.user(), null, 2);

  logout() {
    this.auth.logout();
  }
}
