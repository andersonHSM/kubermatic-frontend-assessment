import { AsyncPipe } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { ProjectsService } from '../../../../services/projects/projects.service';

@Component({
	selector: 'app-projects-list-page',
	imports: [
		FormsModule,
		FloatLabel,
		Button,
		Card,
		InputText,
		AsyncPipe,
		Ripple,
		InputGroup,
		InputGroupAddon,
	],
	templateUrl: './projects-list-page.html',
	styleUrl: './projects-list-page.css',
})
export class ProjectsListPage {
	protected searchTerm = model('');

	private readonly projectsService = inject(ProjectsService);
	protected projects$ = toObservable(this.searchTerm).pipe(
		debounceTime(300),
		distinctUntilChanged(),
		switchMap(searchTerm => {
			console.log(`Searching for projects with name: ${searchTerm}`);

			return this.projectsService.listProjects(searchTerm);
		}),
	);

	protected createProject() {
		// TODO implement create project
	}

	protected resetSearch() {
		this.searchTerm.set('');
	}
}
