import { Route } from '@angular/router';

import { authGuard } from './guards/auth/auth-guard';
import { LoginPage } from './pages/auth/login-page/login-page';
import { ProjectsPage } from './pages/dash/projects/projects-page/projects-page';

export const appRoutes: Route[] = [
	{ path: 'projects', component: ProjectsPage, canActivate: [authGuard] },
	{ path: 'auth', children: [{ path: 'login', component: LoginPage }] },
	{ path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];
