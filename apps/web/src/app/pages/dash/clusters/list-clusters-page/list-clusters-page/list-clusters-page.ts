import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs';

import { ClustersService } from '../../../../../services/clusters/clusters.service';

@Component({
	selector: 'app-list-clusters-page',
	imports: [AsyncPipe, TableModule, Button],

	templateUrl: './list-clusters-page.html',
	styleUrl: './list-clusters-page.css',
})
export class ListClustersPage {
	protected route = inject(ActivatedRoute);
	private readonly clustersService = inject(ClustersService);
	protected clusters$ = this.route.params.pipe(
		filter(params => params['id']),
		map(params => params['id']),
		distinctUntilChanged(),
		switchMap(projectId => this.clustersService.listClusters(projectId)),
	);
}
