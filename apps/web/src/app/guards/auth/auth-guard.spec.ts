import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AuthService } from '../../services/auth/auth.service';

import { authGuard } from './auth-guard';

describe('authGuard', () => {
	const executeGuard: CanActivateFn = (...guardParameters) =>
		TestBed.runInInjectionContext(() => authGuard(...guardParameters));

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				{
					provide: AuthService,
					useValue: { isAuthenticated: jest.fn().mockReturnValue(of(true)) },
				},
			],
		});
	});

	it('should be created', () => {
		expect(executeGuard).toBeTruthy();
	});

	it('should navigate to /auth/login when not authenticated', done => {
		const auth = TestBed.inject(AuthService) as any;
		auth.isAuthenticated.mockReturnValue(of(false));
		const router = TestBed.inject(Router);
		const navSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true as any);

		const result$ = executeGuard({} as any, {} as any) as any;
		result$.subscribe({
			next: () => {
				expect(navSpy).toHaveBeenCalledWith(['/auth/login']);
				done();
			},
			error: done,
		});
	});
});
