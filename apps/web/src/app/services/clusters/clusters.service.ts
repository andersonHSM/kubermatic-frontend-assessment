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

	public listClusters(projectId: string, sortOrder: 'asc' | 'desc' = 'asc') {
		return this.httpClient
			.get<Project>(`projects/${projectId}/clusters`, { params: { sortOrder } })
			.pipe(map(project => project.clusters));
	}

	public createCluster(projectId: string, updatedClusterData: Partial<Cluster>) {
		return this.httpClient.post(`projects/${projectId}/clusters`, updatedClusterData);
	}

	public updateCluster(updatedClusterData: Partial<Cluster>) {
		return this.httpClient.patch(`clusters/${updatedClusterData.id}`, updatedClusterData);
	}

	public deleteCluster(id: string) {
		return this.httpClient.delete(`clusters/${id}`);
	}
}
