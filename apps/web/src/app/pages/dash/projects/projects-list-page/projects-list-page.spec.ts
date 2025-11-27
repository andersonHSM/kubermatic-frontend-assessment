import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ProjectsListPage } from './projects-list-page';

describe('ProjectsListPage', () => {
	let component: ProjectsListPage;
	let fixture: ComponentFixture<ProjectsListPage>;

 beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsListPage, HttpClientTestingModule],
    }).compileComponents();

		fixture = TestBed.createComponent(ProjectsListPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
