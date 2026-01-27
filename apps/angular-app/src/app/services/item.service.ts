// apps/angular-app/src/app/services/item.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Item } from '../models/item.model'; // Erstelle das Interface (id, title, etc.)

@Injectable({ providedIn: 'root' })
export class ItemService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/items`;

  // Das Signal hält den Zustand deiner Items
  private itemsSignal = signal<Item[]>([]);
  public items = this.itemsSignal.asReadonly();

  loadItems() {
    this.http.get<Item[]>(this.apiUrl).subscribe({
      next: (val) => this.itemsSignal.set(val),
      error: (err) => console.error('SHIBUYA API Error:', err),
    });
  }
}
