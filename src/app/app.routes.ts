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
                    import('./features/events/events.component')
                        .then(m => m.EventsComponent)
            },
            { path: '', redirectTo: 'events', pathMatch: 'full' }
        ]
    }
];