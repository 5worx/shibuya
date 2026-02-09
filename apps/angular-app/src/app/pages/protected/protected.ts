import { Component, inject, computed, OnInit } from '@angular/core';
import { AuthService } from '@pckg/auth';
import { PeopleService } from '../../services/people.service'; // Pfad anpassen
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-protected-page',
  standalone: true,
  imports: [JsonPipe], // Wichtig für die Darstellung
  templateUrl: './protected.html',
})
export class ProtectedPage implements OnInit {
  private auth = inject(AuthService);
  private peopleService = inject(PeopleService);

  user = computed(() => this.auth.getUser());
  // Wir machen die Items der Komponente verfügbar
  people = this.peopleService.people;

  ngOnInit() {
    // Sobald die Seite lädt, holen wir die Items vom Rust-Backend
    this.peopleService.loadItems();
  }

  logout() {
    this.auth.logout();
  }
}
