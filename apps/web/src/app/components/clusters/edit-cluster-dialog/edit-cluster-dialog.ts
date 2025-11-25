import { Component, effect, inject, model } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from 'primeng/dialog';

import { Cluster } from '../../../models/cluster.model';

@Component({
	selector: 'app-edit-cluster-dialog',
	imports: [Dialog, ReactiveFormsModule],
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
}
