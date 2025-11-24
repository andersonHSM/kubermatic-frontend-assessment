import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';

@Component({
	selector: 'app-projects-list-page',
	imports: [FormsModule, FloatLabel, Button, Card, InputText],
	templateUrl: './projects-list-page.html',
	styleUrl: './projects-list-page.css',
})
export class ProjectsListPage {
	protected projects = [1, 2, 3];
	protected value = '';

	protected createProject() {
		// TODO implement create project
	}
}
