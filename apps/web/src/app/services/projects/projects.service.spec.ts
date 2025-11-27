import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ProjectsService } from './projects.service';

describe('ProjectsService', () => {
	let service: ProjectsService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		});
		service = TestBed.inject(ProjectsService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('listProjects should GET without params when no search provided', () => {
		service.listProjects().subscribe();
		const req = httpMock.expectOne(r => r.method === 'GET' && r.url === 'projects');
		expect(req.request.params.keys().length).toBe(0);
		req.flush([]);
	});

	it('listProjects should include search param when provided', () => {
		service.listProjects('abc').subscribe();
		const req = httpMock.expectOne('projects?search=abc');
		expect(req.request.method).toBe('GET');
		req.flush([]);
	});
});
