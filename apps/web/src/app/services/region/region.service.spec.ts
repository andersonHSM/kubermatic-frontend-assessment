import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { RegionService } from './region.service';

describe('RegionService', () => {
	let service: RegionService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		});
		service = TestBed.inject(RegionService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('findAll should GET regions', () => {
		service.findAll().subscribe();
		const req = httpMock.expectOne('region');
		expect(req.request.method).toBe('GET');
		req.flush([]);
	});
});
