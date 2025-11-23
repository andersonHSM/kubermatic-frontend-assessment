import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { tap } from 'rxjs';

import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'app-login-page',
	imports: [InputTextModule, FormsModule, FloatLabel, Password, ButtonModule],
	templateUrl: './login-page.html',
	styleUrl: './login-page.css',
})
export class LoginPage {
	private readonly authService = inject(AuthService);
	protected username = '';
	protected password = '';
	protected isLoggingIn = signal(false);

	protected login(username: string, password: string) {
		if (this.isLoggingIn()) {
			return;
		}

		this.isLoggingIn.set(true);

		return this.authService
			.login(username, password)
			.pipe(
				tap({
					next: () => {
						console.log('Login successful');
						this.isLoggingIn.set(false);
					},
					error: () => {
						console.log('Login failed');
						this.isLoggingIn.set(false);
					},
				}),
			)
			.subscribe();
	}
}
