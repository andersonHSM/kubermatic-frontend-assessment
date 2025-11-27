import { TestBed } from '@angular/core/testing';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let cookie: { get: jest.Mock; set: jest.Mock; delete: jest.Mock };

  beforeEach(() => {
    cookie = { get: jest.fn().mockReturnValue(null), set: jest.fn(), delete: jest.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: SsrCookieService, useValue: cookie }],
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function createWithFakeStorage(fake: Partial<Storage>) {
    const storage: Storage = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0,
      ...fake,
    } as any;
    jest
      .spyOn(StorageService.prototype as any, 'getStorage')
      .mockImplementation(() => storage);
    return storage;
  }

  it('setItem should use localStorage when available and ignore errors', () => {
    const local = createWithFakeStorage({ setItem: jest.fn() });
    service = TestBed.inject(StorageService);
    service.setItem('k', 'v');
    expect(local.setItem).toHaveBeenCalledWith('k', 'v');

    // simulate throwing setItem and ensure it does not throw
    (local.setItem as jest.Mock).mockImplementation(() => {
      throw new Error('quota');
    });
    expect(() => service.setItem('k', 'v')).not.toThrow();
  });

  it('getItem should prefer localStorage value; fallback to cookie; and handle errors', () => {
    const local = createWithFakeStorage({ getItem: jest.fn().mockReturnValue('lv') });
    service = TestBed.inject(StorageService);
    expect(service.getItem('k')).toBe('lv');

    // when localStorage returns null, should fallback to cookie
    (local.getItem as jest.Mock).mockReturnValueOnce(null);
    cookie.get.mockReturnValueOnce('cv');
    expect(service.getItem('k')).toBe('cv');

    // when accessing storage throws, should return null
    (local.getItem as jest.Mock).mockImplementationOnce(() => {
      throw new Error('blocked');
    });
    expect(service.getItem('k')).toBeNull();
  });

  it('removeItem should remove from localStorage and delete cookie; ignore errors', () => {
    const local = createWithFakeStorage({ removeItem: jest.fn() });
    service = TestBed.inject(StorageService);
    service.removeItem('k');
    expect(local.removeItem).toHaveBeenCalledWith('k');
    expect(cookie.delete).toHaveBeenCalled();

    (local.removeItem as jest.Mock).mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => service.removeItem('k')).not.toThrow();
  });

  it('should handle environments without storage gracefully', () => {
    jest
      .spyOn(StorageService.prototype as any, 'getStorage')
      .mockImplementation(() => null);
    service = TestBed.inject(StorageService);
    // methods should not throw
    expect(service.getItem('k')).toBeNull();
    expect(() => service.setItem('a', 'b')).not.toThrow();
    expect(() => service.removeItem('a')).not.toThrow();
  });

  it('getStorage returns null when window exists without localStorage', () => {
    // Use real getStorage to cover branch
    jest.restoreAllMocks();
    Object.defineProperty(global as any, 'window', { value: {}, configurable: true });
    service = TestBed.inject(StorageService);
    expect(service.getItem('k')).toBeNull();
  });

  it('getStorage catches errors when accessing window', () => {
    jest.restoreAllMocks();
    const original = Object.getOwnPropertyDescriptor(global as any, 'window');
    Object.defineProperty(global as any, 'window', {
      configurable: true,
      get() {
        throw new Error('blocked');
      },
    });
    service = TestBed.inject(StorageService);
    expect(service.getItem('k')).toBeNull();
    // restore window descriptor
    if (original) Object.defineProperty(global as any, 'window', original);
  });
});
