import { AsyncPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs';

import { ClusterWizard } from '../../../../../components/clusters/edit-cluster-dialog/cluster-wizard';
import { Cluster } from '../../../../../models/cluster.model';
import { ClustersService } from '../../../../../services/clusters/clusters.service';

@Component({
	selector: 'app-list-clusters-page',
	imports: [AsyncPipe, TableModule, Button, ClusterWizard],
	templateUrl: './list-clusters-page.html',
	styleUrl: './list-clusters-page.css',
})
export class ListClustersPage {
	protected route = inject(ActivatedRoute);
	protected visible = signal(false);
	protected selectedCluster = signal<Cluster | null>(null);
	protected action: 'edit' | 'create' = 'edit';
	private readonly clustersService = inject(ClustersService);
	protected clusters$ = this.route.params.pipe(
		filter(params => params['id']),
		map(params => params['id']),
		distinctUntilChanged(),
		switchMap(projectId => this.clustersService.listClusters(projectId)),
	);

	constructor() {
		effect(() => {
			if (!this.visible()) {
				this.selectedCluster.set(null);
			}
		});
	}

	protected editCluster(cluster: Cluster) {
		this.action = 'edit';
		this.selectedCluster.set(cluster);
		this.visible.set(true);
	}

	protected createCluster() {
		this.action = 'create';
		this.visible.set(true);
		this.selectedCluster.set(null);
	}
}
