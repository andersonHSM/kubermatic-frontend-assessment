import { AsyncPipe } from '@angular/common';
import { Component, effect, inject, input, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	FormArray,
	FormBuilder,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {
	AutoComplete,
	AutoCompleteCompleteEvent,
	AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputGroup } from 'primeng/inputgroup';
import { InputText } from 'primeng/inputtext';
import { Slider } from 'primeng/slider';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { Tag } from 'primeng/tag';

import { Cluster } from '../../../models/cluster.model';
import { Labels } from '../../../models/labels.mdel';
import { Region } from '../../../models/region.model';
import { Version } from '../../../models/version.model';
import { ClustersService } from '../../../services/clusters/clusters.service';
import { RegionService } from '../../../services/region/region.service';
import { VersionService } from '../../../services/version/version.service';

@Component({
	selector: 'app-cluster-wizard',
	imports: [
		Dialog,
		ReactiveFormsModule,
		FloatLabel,
		InputText,
		FormsModule,
		Slider,
		InputGroup,
		Button,
		Stepper,
		StepList,
		Step,
		StepPanels,
		StepPanel,
		Tag,
		AutoComplete,
		AsyncPipe,
	],
	templateUrl: './cluster-wizard.html',
	styleUrl: './cluster-wizard.css',
})
export class ClusterWizard {
	public readonly action = input<'edit' | 'create'>('edit');
	public visible = model(false);
	public cluster = model<Cluster | null>(null);
	protected searchVersionModel = signal('');
	protected readonly currentStep = signal<number>(1);
	protected regions = signal<Region[]>([]);
	protected versions = signal<Version[]>([]);
	protected filteredVersions: Version[];
	protected selectedRegion = signal<Region | null>(null);
	protected searchRegionModel = signal('');
	protected filteredRegions: Region[];
	private formBuilder = inject(FormBuilder);
	protected clusterForm = this.formBuilder.group({
		name: this.formBuilder.control('', { validators: [Validators.required] }),
		version: this.formBuilder.control('', { validators: [Validators.required] }),
		region: this.formBuilder.control('', { validators: [Validators.required] }),
		labels: this.formBuilder.array<{ key: string; value: string }>([]),
		labelInput: this.formBuilder.group({
			key: this.formBuilder.control('', { validators: [Validators.required] }),
			value: this.formBuilder.control('', { validators: [Validators.required] }),
		}),
		nodeCount: this.formBuilder.control(0, {
			validators: [Validators.required, Validators.min(1)],
		}),
	});
	private versionService = inject(VersionService);
	private readonly regionService = inject(RegionService);
	private readonly clustersService = inject(ClustersService);

	constructor() {
		this.currentStep.set(1);
		effect(() => {
			this.clusterForm.patchValue({
				nodeCount: this.cluster()?.nodeCount ?? 0,
				region: this.cluster()?.region.code,
				version: this.cluster()?.version.version,
				name: this.cluster()?.name,
			});
			this.selectedRegion.set(this.cluster()?.region ?? null);
			this.searchVersionModel.set(this.cluster()?.version.version ?? '');
			this.searchRegionModel.set(this.cluster()?.region.code ?? '');
			Object.entries(this.cluster()?.labels ?? {}).forEach(([key, value]) => {
				this.clusterForm.controls.labels.push(this.formBuilder.control({ key, value }), {
					emitEvent: true,
				});
			});
		});
		this.versionService
			.findAll()
			.pipe(takeUntilDestroyed())
			.subscribe(versions => {
				this.versions.set(versions);
			});

		this.regionService
			.findAll()
			.pipe(takeUntilDestroyed())
			.subscribe(regions => {
				this.regions.set(regions);
			});
	}

	get labels() {
		return this.clusterForm.get('labels') as FormArray;
	}

	protected onHide() {
		this.currentStep.set(1);
		this.clusterForm.setControl(
			'labels',
			this.formBuilder.array<{ key: string; value: string }>([]),
		);
		this.clusterForm.reset({ nodeCount: 0 });
	}

	protected decreaseNodeCount() {
		const currentNodeCount = this.clusterForm?.value?.nodeCount ?? 0;
		if (currentNodeCount < 1) {
			return;
		}

		this.clusterForm.patchValue(
			{ nodeCount: currentNodeCount - 1 },
			{ emitEvent: true, onlySelf: false },
		);
	}

	protected increaseNodeCount() {
		const currentNodeCount = this.clusterForm?.value?.nodeCount ?? 0;
		this.clusterForm.patchValue(
			{ nodeCount: currentNodeCount + 1 },
			{ emitEvent: true, onlySelf: false },
		);
	}

	protected addLabel(key: string, value: string) {
		this.clusterForm.controls.labels.push(this.formBuilder.control({ key, value }), {});
		this.clusterForm.controls.labelInput.reset({ key: '', value: '' });
	}

	protected searchVersion($event: AutoCompleteCompleteEvent) {
		this.filteredVersions = this.versions().filter(version =>
			version.version.includes($event.query),
		);
	}

	protected saveCluster() {
		const labels: Labels =
			this.clusterForm.value.labels?.reduce((prev, current) => {
				if (!current) return { ...prev };
				return { ...prev, [current['key']]: current['value'] } as Labels;
			}, {} as Labels) ??
			this.cluster()?.labels ??
			{};

		const { region, version, name, nodeCount } = this.clusterForm.value;

		let updatedClusterData: Partial<Cluster> = {
			id: this.cluster()?.id,
			versionId: this.versions().find(_version => _version.version === version)?.id,
			regionId: this.regions().find(_region => _region.code === region)?.id,
		};

		if (name) updatedClusterData = { ...updatedClusterData, name };
		if (nodeCount) updatedClusterData = { ...updatedClusterData, nodeCount };
		if (Object.keys(labels).length > 0) updatedClusterData = { ...updatedClusterData, labels };

		if (this.action() === 'create') {
			return this.clustersService.createCluster(updatedClusterData);
		}
		return this.clustersService.updateCluster(updatedClusterData);
	}

	protected searchRegion($event: AutoCompleteCompleteEvent) {
		this.filteredRegions = this.regions().filter(region =>
			region.code.toLowerCase().includes($event.query.toLowerCase()),
		);
	}

	protected onRegionChange($event: AutoCompleteSelectEvent) {
		this.clusterForm.patchValue({ region: $event.value.code }, { emitEvent: true });

		this.selectedRegion.set(
			this.regions().find(region => region.code === $event.value.code) ?? null,
		);
	}

	protected onVersionChange($event: AutoCompleteSelectEvent) {
		this.clusterForm.patchValue({ version: $event.value.version }, { emitEvent: true });
	}
}
