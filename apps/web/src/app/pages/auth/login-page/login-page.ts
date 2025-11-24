import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
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
export class LoginPage implements OnInit {
	protected email = '';
	protected password = '';
	protected isLoggingIn = signal(false);
	private readonly authService = inject(AuthService);
	private readonly cookieService = inject(SsrCookieService);
	private readonly router = inject(Router);

	ngOnInit(): void {
		console.log('onInit');
		// this.cookieService.deleteAll();
	}

	protected login(email: string, password: string) {
		if (this.isLoggingIn()) {
			return;
		}

		this.isLoggingIn.set(true);

		return this.authService
			.login(email, password)
			.pipe(
				tap({
					next: async () => {
						console.log('Login successful');
						this.isLoggingIn.set(false);
						await this.router.navigate(['/projects']);
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
