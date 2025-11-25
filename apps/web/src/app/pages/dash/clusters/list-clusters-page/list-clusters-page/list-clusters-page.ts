import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs';

import { EditClusterDialog } from '../../../../../components/clusters/edit-cluster-dialog/edit-cluster-dialog';
import { Cluster } from '../../../../../models/cluster.model';
import { ClustersService } from '../../../../../services/clusters/clusters.service';

@Component({
	selector: 'app-list-clusters-page',
	imports: [AsyncPipe, TableModule, Button, EditClusterDialog],

	templateUrl: './list-clusters-page.html',
	styleUrl: './list-clusters-page.css',
})
export class ListClustersPage {
	protected route = inject(ActivatedRoute);
	protected visible = signal(false);

	private readonly clustersService = inject(ClustersService);

	protected clusters$ = this.route.params.pipe(
		filter(params => params['id']),
		map(params => params['id']),
		distinctUntilChanged(),
		switchMap(projectId => this.clustersService.listClusters(projectId)),
	);

	protected editCluster(cluster: Cluster) {
		this.visible.set(true);
	}
}
