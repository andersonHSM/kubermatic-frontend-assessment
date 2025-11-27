import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ClustersService } from './clusters.service';

describe('ClustersService', () => {
	let service: ClustersService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		});
		service = TestBed.inject(ClustersService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('listClusters should GET with params and map clusters', () => {
		const projectId = 'p1';
		const clusters = [{ id: 'c1' }];
		service.listClusters(projectId, 'desc', 'name', 'region').subscribe(result => {
			expect(result).toEqual(clusters as any);
		});
		const req = httpMock.expectOne(
			r => r.method === 'GET' && r.url === `projects/${projectId}/clusters`,
		);
		expect(req.request.params.get('sortOrder')).toBe('desc');
		expect(req.request.params.get('name')).toBe('name');
		expect(req.request.params.get('region')).toBe('region');
		req.flush({ clusters } as any);
	});

	it('listClusters should use default sortOrder; filters default to undefined values', () => {
		const projectId = 'p2';
		service.listClusters(projectId).subscribe();
		const req = httpMock.expectOne(
			r => r.method === 'GET' && r.url === `projects/${projectId}/clusters`,
		);
		// default sortOrder should be asc
		expect(req.request.params.get('sortOrder')).toBe('asc');
		// name/region are passed as undefined -> serialized as 'undefined' by HttpParams
		expect(req.request.params.get('name')).toBe('undefined');
		expect(req.request.params.get('region')).toBe('undefined');
		req.flush({ clusters: [] } as any);
	});

	it('createCluster should POST to project clusters', () => {
		const projectId = 'p1';
		const payload = { name: 'x' };
		service.createCluster(projectId, payload as any).subscribe();
		const req = httpMock.expectOne(`projects/${projectId}/clusters`);
		expect(req.request.method).toBe('POST');
		expect(req.request.body).toEqual(payload);
		req.flush({});
	});

	it('updateCluster should PATCH to cluster id', () => {
		const body = { id: 'c1', name: 'n' } as any;
		service.updateCluster(body).subscribe();
		const req = httpMock.expectOne(`clusters/${body.id}`);
		expect(req.request.method).toBe('PATCH');
		expect(req.request.body).toEqual(body);
		req.flush({});
	});

	it('deleteCluster should DELETE by id', () => {
		service.deleteCluster('c1').subscribe();
		const req = httpMock.expectOne('clusters/c1');
		expect(req.request.method).toBe('DELETE');
		req.flush({});
	});
});
