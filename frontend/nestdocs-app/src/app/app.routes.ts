import { Routes } from '@angular/router';
import { FrontendPlayground } from './features/frontend-playground/frontend-playground';
import { BackendPlayground } from './features/backend-playground/backend-playground';

export const routes: Routes = [
  { path: '', redirectTo: '/frontend', pathMatch: 'full' },
  { path: 'frontend', component: FrontendPlayground },
  { path: 'backend', component: BackendPlayground },
];
