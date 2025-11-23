import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class LocalStorageService {
	private readonly storage: Storage | null = this.getStorage();

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
			return this.storage?.getItem(key) ?? null;
		} catch {
			return null;
		}
	}

	public removeItem(key: string): void {
		try {
			this.storage?.removeItem(key);
		} catch {
			// ignore
		}
	}
}
