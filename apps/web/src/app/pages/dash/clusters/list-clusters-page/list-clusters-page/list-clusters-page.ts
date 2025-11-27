import { AsyncPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { InputText } from 'primeng/inputtext';
import { TableFilterEvent, TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import {
	BehaviorSubject,
	combineLatest,
	distinctUntilChanged,
	filter,
	map,
	switchMap,
	take,
	tap,
} from 'rxjs';

import { ClusterWizard } from '../../../../../components/clusters/edit-cluster-dialog/cluster-wizard';
import { Cluster } from '../../../../../models/cluster.model';
import { ClustersService } from '../../../../../services/clusters/clusters.service';

@Component({
	selector: 'app-list-clusters-page',
	imports: [
		AsyncPipe,
		TableModule,
		Button,
		ClusterWizard,
		Toast,
		ConfirmPopup,
		InputText,
		FormsModule,
	],
	providers: [MessageService, ConfirmationService],
	templateUrl: './list-clusters-page.html',
	styleUrl: './list-clusters-page.css',
})
export class ListClustersPage {
	protected route = inject(ActivatedRoute);
	protected visible = signal(false);
	protected selectedCluster = signal<Cluster | null>(null);
	protected updateClusters$ = new BehaviorSubject<boolean>(true);
	protected updateClusterSort$ = new BehaviorSubject<'asc' | 'desc'>('asc');
	protected action: 'edit' | 'create' = 'edit';
	protected nameFilter = signal('');
	protected regionFilter = signal('');
	private readonly sortOrderMapper: { [k: number]: 'asc' | 'desc' } = { 1: 'asc', [-1]: 'desc' };
	private readonly clustersService = inject(ClustersService);
	protected clusters$ = combineLatest([
		this.route.params.pipe(
			filter(params => params['id']),
			map(params => params['id'] as string),
			distinctUntilChanged(),
		),
		this.updateClusters$,
		this.updateClusterSort$.pipe(distinctUntilChanged()),
		toObservable(this.nameFilter),
		toObservable(this.regionFilter),
	]).pipe(
		switchMap(([projectId, , sortOrder, name, region]) => {
			return this.clustersService.listClusters(projectId, sortOrder, name, region);
		}),
	);
	// protected clusters$ = this.route.params.pipe(
	// 	filter(params => params['id']),
	// 	map(params => params['id']),
	// 	distinctUntilChanged(),
	// 	switchMap(projectId =>
	// 		this.updateClusters$.pipe(
	// 			switchMap(() =>
	// 				this.updateClusterSort$.pipe(
	// 					distinctUntilChanged(),
	// 					switchMap(sortOrder => this.clustersService.listClusters(projectId, sortOrder)),
	// 				),
	// 			),
	// 		),
	// 	),
	// );
	private readonly messageService = inject(MessageService);
	private readonly confirmationService = inject(ConfirmationService);

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

	protected updateList() {
		this.updateClusters$.next(true);
	}

	protected deleteCluster(event: Event, cluster: Cluster) {
		this.confirmationService.confirm({
			target: event.currentTarget as EventTarget,
			message: 'Do you want to delete this cluster?',
			icon: 'pi pi-info-circle',
			rejectButtonProps: {
				label: 'Cancel',
				severity: 'secondary',
				outlined: true,
			},
			acceptButtonProps: {
				label: 'Delete',
				severity: 'danger',
			},
			accept: () => {
				this.clustersService
					.deleteCluster(cluster.id)
					.pipe(
						take(1),

						tap(() => {
							this.messageService.add({
								severity: 'info',
								summary: 'Confirmed',
								detail: 'Cluster deleted',
								life: 3000,
							});
							this.updateClusters$.next(true);
						}),
					)
					.subscribe();
			},
		});
	}

	protected onSort(event: { field: string; order: number }) {
		this.updateClusterSort$.next(this.sortOrderMapper[event.order]);
	}
}
