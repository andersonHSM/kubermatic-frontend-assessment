import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Password } from 'primeng/password';

@Component({
	selector: 'app-login-page',
	imports: [InputTextModule, FormsModule, FloatLabel, Password, ButtonModule],
	templateUrl: './login-page.html',
	styleUrl: './login-page.css',
})
export class LoginPage {
	protected username = '';
	protected password = '';

	protected login(username: string, password: string) {
		console.log({ username, password });
	}
}
