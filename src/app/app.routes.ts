import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'events',
        loadComponent: () =>
          import('./features/events/events.component').then((m) => m.EventsComponent),
      },
      {
        path: 'events/create',
        loadComponent: () =>
          import('./features/events/create-event/create-event.component').then(
            (m) => m.CreateEventComponent,
          ),
      },
      {
        path: 'events/edit/:id',
        loadComponent: () =>
          import('./features/events/create-event/create-event.component').then(
            (m) => m.CreateEventComponent,
          ),
      },
      { path: '', redirectTo: 'events', pathMatch: 'full' },
    ],
  },
];
