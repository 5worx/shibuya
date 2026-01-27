import { Component, inject, computed, OnInit } from '@angular/core';
import { AuthService } from '@shibuya/auth';
import { ItemService } from '../../services/item.service'; // Pfad anpassen
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-protected-page',
  standalone: true,
  imports: [JsonPipe], // Wichtig für die Darstellung
  templateUrl: './protected.html',
})
export class ProtectedPage implements OnInit {
  private auth = inject(AuthService);
  private itemService = inject(ItemService);

  user = computed(() => this.auth.getUser());
  // Wir machen die Items der Komponente verfügbar
  items = this.itemService.items;

  ngOnInit() {
    // Sobald die Seite lädt, holen wir die Items vom Rust-Backend
    this.itemService.loadItems();
  }

  logout() {
    this.auth.logout();
  }
}
