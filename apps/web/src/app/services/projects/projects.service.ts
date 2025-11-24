import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Project } from '@db/output/generated/prisma';

@Injectable({
	providedIn: 'root',
})
export class ProjectsService {
	private readonly httpClient = inject(HttpClient);

	public listProjects() {
		return this.httpClient.get<Project[]>('projects');
	}
}
