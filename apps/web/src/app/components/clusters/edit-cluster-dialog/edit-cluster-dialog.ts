import { Component, inject, model } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputGroup } from 'primeng/inputgroup';
import { InputText } from 'primeng/inputtext';
import { Slider } from 'primeng/slider';

import { Cluster } from '../../../models/cluster.model';

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
	],
	templateUrl: './edit-cluster-dialog.html',
	styleUrl: './edit-cluster-dialog.css',
})
export class EditClusterDialog {
	public visible = model(false);
	public cluster = model<Cluster | null>(null);

	private formBuilder = inject(FormBuilder);

	protected clusterForm = this.formBuilder.group({
		name: this.formBuilder.control('', { validators: [Validators.required] }),
		version: this.formBuilder.control('', { validators: [Validators.required] }),
		region: this.formBuilder.control('', { validators: [Validators.required] }),
		labels: this.formBuilder.array([]),
		nodeCount: this.formBuilder.control(0, {
			validators: [Validators.required, Validators.min(1)],
		}),
	});

	protected onHide() {
		console.log('closing dialog');
	}

	protected decreaseNodeCount() {
		const currentNodeCount = this.clusterForm?.value?.nodeCount ?? 0;
		if (currentNodeCount < 1) {
			return;
		}

		this.clusterForm.patchValue({ nodeCount: currentNodeCount - 1 });
	}

	protected increaseNodeCount() {
		const currentNodeCount = this.clusterForm?.value?.nodeCount ?? 0;
		this.clusterForm.patchValue({ nodeCount: currentNodeCount + 1 });
	}
}
