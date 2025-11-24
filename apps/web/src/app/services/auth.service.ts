import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, filter, map, Observable, of, tap } from 'rxjs';

import { LocalStorageService } from './local-storage.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private static readonly TOKEN_KEY = 'authToken';
	private readonly httpClient = inject(HttpClient);
	private readonly storage = inject(LocalStorageService);

	public login(email: string, password: string) {
		return this.httpClient
			.post<string>('auth/login', { email, password }, { responseType: 'text' as 'json' })
			.pipe(
				filter(token => token !== null),
				tap(token => {
					if (token.length > 0) {
						this.storage.setItem(AuthService.TOKEN_KEY, token);
					}
				}),
			);
	}

	public isAuthenticated(): Observable<boolean> {
		return this.httpClient.post('auth/token', {}).pipe(
			map(res => res !== null),
			catchError(() => of(false)),
		);
	}

	public getToken(): string | null {
		return this.storage.getItem(AuthService.TOKEN_KEY);
	}

	public clearToken(): void {
		this.storage.removeItem(AuthService.TOKEN_KEY);
	}
}
