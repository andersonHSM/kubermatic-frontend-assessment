import { HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { environment } from '../../environments/environment';

import { baseUrlInterceptor } from './base-url.interceptor';

describe('baseUrlInterceptor', () => {
	function run(req: HttpRequest<unknown>, next: HttpHandlerFn) {
		return TestBed.runInInjectionContext(() => baseUrlInterceptor(req, next));
	}

	it('should prefix request URL with environment.apiUrl', done => {
		const originalUrl = 'projects';
		const req = new HttpRequest('GET', originalUrl);
		const next: HttpHandlerFn = r => {
			expect(r.url).toBe(`${environment.apiUrl}/${originalUrl}`);
			return of(new HttpResponse({ status: 200 })) as any;
		};

		run(req, next).subscribe(() => done());
	});
});
