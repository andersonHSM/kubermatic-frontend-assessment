import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

import { AuthService } from 'apps/web/src/app/services/auth/auth.service';
import { StorageService } from '../storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const cookieSvcMock = {
    delete: jest.fn(),
    set: jest.fn(),
    get: jest.fn().mockReturnValue(null),
  } as unknown as SsrCookieService;
  const storageMock = {
    setItem: jest.fn(),
    getItem: jest.fn().mockReturnValue(null),
    removeItem: jest.fn(),
  } as unknown as StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SsrCookieService, useValue: cookieSvcMock },
        { provide: StorageService, useValue: storageMock },
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should POST and store token when provided', () => {
    const token = 'abc123';
    service.login('user@example.com', 'pwd').subscribe();
    const req = httpMock.expectOne('auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(token);
    expect(cookieSvcMock.delete).toHaveBeenCalledWith('token');
    expect(cookieSvcMock.set).toHaveBeenCalled();
    expect(storageMock.setItem).toHaveBeenCalled();
  });

  it('isAuthenticated should map non-null to true', done => {
    service.isAuthenticated().subscribe(val => {
      expect(val).toBe(true);
      done();
    });
    const req = httpMock.expectOne('auth/token');
    expect(req.request.method).toBe('POST');
    req.flush({ ok: true });
  });

  it('isAuthenticated should handle error as false', done => {
    service.isAuthenticated().subscribe(val => {
      expect(val).toBe(false);
      done();
    });
    const req = httpMock.expectOne('auth/token');
    req.flush('bad', { status: 500, statusText: 'Server Error' });
  });

  it('getToken should return value from storage', () => {
    (storageMock.getItem as any) = jest.fn().mockReturnValue('abc');
    expect(service.getToken()).toBe('abc');
  });

  it('clearToken should call storage.removeItem', () => {
    service.clearToken();
    expect(storageMock.removeItem).toHaveBeenCalled();
  });
});
