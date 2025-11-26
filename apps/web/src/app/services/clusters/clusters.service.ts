import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

import { Cluster } from '../../models/cluster.model';
import { Project } from '../../models/project.model';

@Injectable({
	providedIn: 'root',
})
export class ClustersService {
	private readonly httpClient = inject(HttpClient);

	public listClusters(projectId: string) {
		return this.httpClient
			.get<Project>(`projects/${projectId}/clusters`)
			.pipe(map(project => project.clusters));
	}

	public updateCluster(updatedClusterData: Partial<Cluster>) {
		console.log(updatedClusterData);
	}

	public createCluster(projectId: string, updatedClusterData: Partial<Cluster>) {
		console.log({ updatedClusterData, projectId });
	}
}
