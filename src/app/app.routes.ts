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
    path: 'invite/:token',
    loadComponent: () =>
      import('./features/events/external-invitation/external-invitation.component').then(
        (m) => m.ExternalInvitationComponent,
      ),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'workspace',
        loadComponent: () =>
          import('./features/workspace/workspace.component').then((m) => m.WorkspaceComponent),
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
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./features/events/event-details/event-details.component').then(
            (m) => m.EventDetailsComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
