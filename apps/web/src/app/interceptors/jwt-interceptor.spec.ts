import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { jwtInterceptor } from './jwt-interceptor';
import { AuthService } from 'apps/web/src/app/services/auth/auth.service';

describe('jwtInterceptor', () => {
  function run(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    return TestBed.runInInjectionContext(() => jwtInterceptor(req, next));
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            getToken: jest.fn().mockReturnValue(null),
          },
        },
      ],
    });
  });

  it('should pass through without Authorization header when no token', done => {
    const req = new HttpRequest('GET', '/api');
    const next: HttpHandlerFn = (r: HttpRequest<any>) => {
      expect(r.headers.has('Authorization')).toBe(false);
      return of(new HttpResponse({ status: 200 })) as unknown as Promise<HttpEvent<any>> as any;
    };
    run(req, next).subscribe(() => done());
  });

  it('should add Authorization header when token is present', done => {
    const auth = TestBed.inject(AuthService) as any;
    auth.getToken.mockReturnValue('tkn');
    const req = new HttpRequest('GET', '/api');
    const next: HttpHandlerFn = (r: HttpRequest<any>) => {
      expect(r.headers.get('Authorization')).toBe('Bearer tkn');
      return of(new HttpResponse({ status: 200 })) as unknown as Promise<HttpEvent<any>> as any;
    };
    run(req, next).subscribe(() => done());
  });
});
