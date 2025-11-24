import { inject, Injectable } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {
	private readonly jwtTokenCookie = 'token';

	private readonly storage: Storage | null = this.getStorage();
	private readonly ssrCookieService = inject(SsrCookieService);

	private getStorage(): Storage | null {
		try {
			if (typeof window !== 'undefined' && 'localStorage' in window) {
				return window.localStorage;
			}
		} catch {
			// Accessing window/localStorage might throw in some environments
		}
		return null;
	}

	public setItem(key: string, value: string): void {
		try {
			this.storage?.setItem(key, value);
		} catch {
			// Ignore quota/security errors
		}
	}

	public getItem(key: string): string | null {
		try {
			return this.storage?.getItem(key) ?? this.ssrCookieService.get(this.jwtTokenCookie);
		} catch {
			return null;
		}
	}

	public removeItem(key: string): void {
		try {
			this.storage?.removeItem(key);
			this.ssrCookieService.delete(this.jwtTokenCookie);
		} catch {
			// ignore
		}
	}
}
