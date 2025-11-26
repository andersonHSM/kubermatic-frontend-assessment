import { AsyncPipe } from '@angular/common';
import { Component, effect, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	FormArray,
	FormBuilder,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputGroup } from 'primeng/inputgroup';
import { InputText } from 'primeng/inputtext';
import { Slider } from 'primeng/slider';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { Tag } from 'primeng/tag';

import { Cluster } from '../../../models/cluster.model';
import { Region } from '../../../models/region.model';
import { Version } from '../../../models/version.model';
import { RegionService } from '../../../services/region/region.service';
import { VersionService } from '../../../services/version/version.service';

@Component({
	selector: 'app-edit-cluster-dialog',
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
	templateUrl: './edit-cluster-dialog.html',
	styleUrl: './edit-cluster-dialog.css',
})
export class EditClusterDialog {
	public visible = model(false);
	public cluster = model<Cluster | null>(null);
	protected searchVersionModel = signal('');
	protected readonly currentStep = signal<number>(1);
	protected regions = signal<Region[]>([]);
	protected versions = signal<Version[]>([]);
	protected filteredVersions: Version[];
	protected selectedRegion = signal<Region | null>(null);
	private formBuilder = inject(FormBuilder);
	protected clusterForm = this.formBuilder.group({
		name: this.formBuilder.control('', { validators: [Validators.required] }),
		version: this.formBuilder.control('', { validators: [Validators.required] }),
		region: this.formBuilder.control('', { validators: [Validators.required] }),
		labels: this.formBuilder.array([]),
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
	protected searchRegionModel = signal('');
	protected filteredRegions: Region[];

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
		this.clusterForm.setControl('labels', this.formBuilder.array([]));
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
		console.log('oi');
		console.log(this.clusterForm.value);
	}

	protected searchRegion($event: AutoCompleteCompleteEvent) {
		this.filteredRegions = this.regions().filter(
			region => region.code.includes($event.query) || region.name.includes($event.query),
		);
	}
}
