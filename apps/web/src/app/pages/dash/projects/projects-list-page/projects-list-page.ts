import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';

import { ProjectsService } from '../../../../services/projects/projects.service';

@Component({
	selector: 'app-projects-list-page',
	imports: [FormsModule, FloatLabel, Button, Card, InputText, AsyncPipe, Ripple],
	templateUrl: './projects-list-page.html',
	styleUrl: './projects-list-page.css',
})
export class ProjectsListPage {
	protected value = '';

	private readonly projectsService = inject(ProjectsService);
	protected projects$ = this.projectsService.listProjects();

	protected createProject() {
		// TODO implement create project
	}
}
