import { Route } from '@angular/router';

import { authGuard } from './guards/auth/auth-guard';
import { LoginPage } from './pages/auth/login-page/login-page';
import { ListClustersPage } from './pages/dash/clusters/list-clusters-page/list-clusters-page/list-clusters-page';
import { ProjectsListPage } from './pages/dash/projects/projects-list-page/projects-list-page';
import { ProjectsPage } from './pages/dash/projects/projects-page/projects-page';

export const appRoutes: Route[] = [
	{
		path: 'projects',
		component: ProjectsPage,
		canActivate: [authGuard],
		canActivateChild: [authGuard],
		children: [
			{ path: '', component: ProjectsListPage },
			{ path: ':id/clusters', component: ListClustersPage },
		],
	},
	{ path: 'auth', children: [{ path: 'login', component: LoginPage }] },
	{ path: '**', redirectTo: '/auth/login', pathMatch: 'full' },
];
