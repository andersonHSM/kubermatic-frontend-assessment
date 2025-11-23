import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly httpClient = inject(HttpClient);

	public login(username: string, password: string) {
		return this.httpClient.post('auth/login', { username, password });
	}
}
