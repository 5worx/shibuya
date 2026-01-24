import { Routes } from '@angular/router';
import { DefaultLayout } from './layouts/default';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/start/start').then((m) => m.StartPage),
      },
      {
        path: 'protected',
        // Hier binden wir den Guard ein
        canActivate: [authGuard],
        loadComponent: () => import('./pages/protected/protected').then((m) => m.ProtectedPage),
      },
    ],
  },
];
