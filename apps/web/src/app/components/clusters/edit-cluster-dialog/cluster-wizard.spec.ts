import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterWizard } from './cluster-wizard';

describe('EditClusterDialog', () => {
	let component: ClusterWizard;
	let fixture: ComponentFixture<ClusterWizard>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ClusterWizard],
		}).compileComponents();

		fixture = TestBed.createComponent(ClusterWizard);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
