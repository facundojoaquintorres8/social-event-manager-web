import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [guestGuard],
  },
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
