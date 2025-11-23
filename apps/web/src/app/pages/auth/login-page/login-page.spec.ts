import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from 'apps/web/src/app/pages/auth/login-page/login-page';

describe('LoginPage', () => {
	let component: LoginPage;
	let fixture: ComponentFixture<LoginPage>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LoginPage],
		}).compileComponents();

		fixture = TestBed.createComponent(LoginPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
