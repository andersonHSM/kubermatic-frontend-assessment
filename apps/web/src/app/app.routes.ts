import { Route } from '@angular/router';

import { LoginPage } from './pages/auth/login-page/login-page';
import { ProjectsPage } from './pages/dash/projects/projects-page/projects-page';

export const appRoutes: Route[] = [
	{ path: 'auth', children: [{ path: 'login', component: LoginPage }] },
	{ path: 'projects', component: ProjectsPage },
	{ path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];
