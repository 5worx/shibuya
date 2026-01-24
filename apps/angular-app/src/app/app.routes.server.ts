import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'protected',
    renderMode: RenderMode.Server, // Oder RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
