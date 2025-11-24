import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';

import { Project } from '../../models/project.model';

@Injectable({
	providedIn: 'root',
})
export class ClustersService {
	private readonly httpClient = inject(HttpClient);

	public listClusters(projectId: string) {
		return this.httpClient.get<Project>(`projects/${projectId}/clusters`).pipe(
			tap(console.log),
			map(project => project.clusters),
		);
	}
}
