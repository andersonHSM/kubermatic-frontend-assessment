import { Component, model } from '@angular/core';
import { Dialog } from 'primeng/dialog';

@Component({
	selector: 'app-edit-cluster-dialog',
	imports: [Dialog],
	templateUrl: './edit-cluster-dialog.html',
	styleUrl: './edit-cluster-dialog.css',
})
export class EditClusterDialog {
	public visible = model(false);
}
