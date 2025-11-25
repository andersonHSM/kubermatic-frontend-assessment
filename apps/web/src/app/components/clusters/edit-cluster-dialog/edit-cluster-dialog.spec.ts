import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditClusterDialog } from './edit-cluster-dialog';

describe('EditClusterDialog', () => {
	let component: EditClusterDialog;
	let fixture: ComponentFixture<EditClusterDialog>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [EditClusterDialog],
		}).compileComponents();

		fixture = TestBed.createComponent(EditClusterDialog);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
