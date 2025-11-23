import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { tap } from 'rxjs';

import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'app-login-page',
	imports: [InputTextModule, FormsModule, FloatLabel, Password, ButtonModule, RouterModule],
	templateUrl: './login-page.html',
	styleUrl: './login-page.css',
})
export class LoginPage {
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);
	protected email = '';
	protected password = '';
	protected isLoggingIn = signal(false);

	protected login(email: string, password: string) {
		if (this.isLoggingIn()) {
			return;
		}

		this.isLoggingIn.set(true);

		return this.authService
			.login(email, password)
			.pipe(
				tap({
					next: () => {
						console.log('Login successful');
						this.isLoggingIn.set(false);
						this.router.navigate(['/projects']);
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
