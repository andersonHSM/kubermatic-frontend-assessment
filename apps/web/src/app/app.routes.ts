import { Route } from '@angular/router';

import { LoginPage } from './pages/auth/login-page/login-page';

export const appRoutes: Route[] = [
	{ path: 'auth', children: [{ path: 'login', component: LoginPage }] },
	{ path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];
