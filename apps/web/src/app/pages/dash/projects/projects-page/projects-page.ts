import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';

@Component({
	selector: 'app-projects-page',
	imports: [RouterOutlet, Menubar],
	templateUrl: './projects-page.html',
	styleUrl: './projects-page.css',
})
export class ProjectsPage {
	protected items: MenuItem[] = [{ label: 'Projects', routerLink: '/projects' }];
}
