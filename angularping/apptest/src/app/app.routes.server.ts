import { RenderMode, ServerRoute } from '@angular/ssr';
/**
     * MAIN SERVER COMPONENT
     */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
