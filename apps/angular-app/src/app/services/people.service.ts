// apps/angular-app/src/app/services/item.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Person } from '../models/person.model'; // Erstelle das Interface (id, title, etc.)

@Injectable({ providedIn: 'root' })
export class PeopleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/people`;

  // Das Signal hält den Zustand deiner Items
  private personsSignal = signal<Person[]>([]);
  public people = this.personsSignal.asReadonly();

  loadItems() {
    this.http.get<Person[]>(this.apiUrl).subscribe({
      next: (val) => this.personsSignal.set(val),
      error: (err) => console.error('SHIBUYA API Error:', err),
    });
  }
}
