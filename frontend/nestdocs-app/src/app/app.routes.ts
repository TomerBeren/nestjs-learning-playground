import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/frontend', pathMatch: 'full' },
  {
    path: 'frontend',
    loadComponent: () => import('./features/frontend-playground/frontend-playground').then(m => m.FrontendPlayground)
  },
  {
    path: 'backend',
    loadComponent: () => import('./features/backend-playground/backend-playground').then(m => m.BackendPlayground)
  },
];
