import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

import { StorageService } from '../../../services/storage.service';

import { LoginPage } from './login-page';

describe('LoginPage', () => {
	let component: LoginPage;
	let fixture: ComponentFixture<LoginPage>;

 beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: SsrCookieService, useValue: { get: jest.fn(), set: jest.fn(), delete: jest.fn() } },
        { provide: StorageService, useValue: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() } },
      ],
    }).compileComponents();

		fixture = TestBed.createComponent(LoginPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
