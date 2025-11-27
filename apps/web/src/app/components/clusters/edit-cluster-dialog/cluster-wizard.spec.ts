import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ClustersService } from '../../../services/clusters/clusters.service';
import { RegionService } from '../../../services/region/region.service';
import { VersionService } from '../../../services/version/version.service';

import { ClusterWizard } from './cluster-wizard';

describe('EditClusterDialog', () => {
	let component: ClusterWizard;
	let fixture: ComponentFixture<ClusterWizard>;
	let clustersSvcMock: { createCluster: jest.Mock; updateCluster: jest.Mock };

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ClusterWizard, HttpClientTestingModule, RouterTestingModule, NoopAnimationsModule],
			providers: [
				{ provide: VersionService, useValue: { findAll: () => of([]) } },
				{ provide: RegionService, useValue: { findAll: () => of([]) } },
				{
					provide: ClustersService,
					useFactory: () => {
						clustersSvcMock = {
							createCluster: jest.fn().mockReturnValue(of({})),
							updateCluster: jest.fn().mockReturnValue(of({})),
						};
						return clustersSvcMock;
					},
				},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ClusterWizard);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should increase and decrease node count with guards', () => {
		// default 1, decrease should be no-op
		component['decreaseNodeCount']();
		expect(component['clusterForm'].value.nodeCount).toBe(1);
		component['increaseNodeCount']();
		expect(component['clusterForm'].value.nodeCount).toBe(2);
		component['decreaseNodeCount']();
		expect(component['clusterForm'].value.nodeCount).toBe(1);
	});

	it('should add a label and then reset label input', () => {
		component['addLabel']('env', 'prod');
		const labels = component['clusterForm'].controls.labels.value;
		expect(labels?.length).toBe(1);
		expect(labels?.[0]).toEqual({ key: 'env', value: 'prod' });
		// label input is reset
		expect(component['clusterForm'].controls.labelInput.value).toEqual({ key: '', value: '' });
	});

	it('searchVersion should filter versions list', () => {
		// arrange versions
		const versions = [
			{ id: '1', version: '1.27' },
			{ id: '2', version: '1.28' },
		] as any;
		component['versions'].set(versions);
		component['searchVersion']({ originalEvent: {} as any, query: '1.28' } as any);
		expect(component['filteredVersions'].length).toBe(1);
		expect(component['filteredVersions'][0].version).toBe('1.28');
	});

 it('searchRegion should filter regions case-insensitively', () => {
		const regions = [
			{ id: 'r1', code: 'us-east', name: 'US East' },
			{ id: 'r2', code: 'eu-west', name: 'EU West' },
		] as any;
		component['regions'].set(regions);
		component['searchRegion']({ originalEvent: {} as any, query: 'EU' } as any);
		expect(component['filteredRegions'].length).toBe(1);
		expect(component['filteredRegions'][0].code).toBe('eu-west');
 });

 it('searchRegion should yield empty list when no matches', () => {
   component['regions'].set([
     { id: 'r1', code: 'us-east', name: 'US East' },
     { id: 'r2', code: 'eu-west', name: 'EU West' },
   ] as any);
   component['searchRegion']({ originalEvent: {} as any, query: 'ap-south' } as any);
   expect(component['filteredRegions']?.length ?? 0).toBe(0);
 });

	it('onRegionChange should update form and selectedRegion', () => {
		const regions = [
			{ id: 'r1', code: 'us-east', name: 'US East' },
			{ id: 'r2', code: 'eu-west', name: 'EU West' },
		] as any;
		component['regions'].set(regions);
		component['onRegionChange']({ value: { code: 'eu-west' } } as any);
		expect(component['clusterForm'].value.region).toBe('eu-west');
		expect(component['selectedRegion']()).toEqual(regions[1]);
	});

 it('onVersionChange should update version in form', () => {
		component['onVersionChange']({ value: { version: '1.29' } } as any);
		expect(component['clusterForm'].value.version).toBe('1.29');
 });

 it('onRegionChange with unknown code should set selectedRegion to null while patching form', () => {
   component['regions'].set([] as any);
   component['onRegionChange']({ value: { code: 'unknown' } } as any);
   expect(component['clusterForm'].value.region).toBe('unknown');
   expect(component['selectedRegion']()).toBeNull();
 });

	it('removeLabel should remove by index', () => {
		component['labels'].push((component as any)['formBuilder'].control({ key: 'k1', value: 'v1' }));
		component['labels'].push((component as any)['formBuilder'].control({ key: 'k2', value: 'v2' }));
		expect(component['labels'].length).toBe(2);
		component['removeLabel'](0);
		expect(component['labels'].length).toBe(1);
		expect(component['labels'].value?.[0]).toEqual({ key: 'k2', value: 'v2' });
	});

 it('disabledAddLabelButton$ should be true when key/value missing; false when unique; true when duplicate', fakeAsync(() => {
		let val: boolean | undefined;
		const sub = (component as any)['disabledAddLabelButton$'].subscribe((v: boolean) => (val = v));
		// initial state has empty key/value -> true
		tick();
		expect(val).toBe(true);

		// now set a valid unique key/value -> false
		component['clusterForm'].controls.labelInput.patchValue({ key: 'a', value: 'b' });
		tick();
		expect(val).toBe(false);

		// add label so duplicate becomes true again
		component['addLabel']('a', 'b');
		component['clusterForm'].controls.labelInput.patchValue({ key: 'a', value: 'x' });
		tick();
		expect(val).toBe(true);
		sub.unsubscribe();
 }));

 it('hydrateClusterData should patch form when visible and cluster is set in edit mode', fakeAsync(() => {
		const mockCluster = {
			id: 'c1',
			name: 'cluster-1',
			nodeCount: 3,
			region: { id: 'r1', code: 'eu-west', name: 'EU West' },
			version: { id: 'v1', version: '1.28' },
			labels: { a: '1', b: '2' },
		} as any;
		component['regions'].set([mockCluster.region]);
		component['versions'].set([mockCluster.version]);
		component['visible'].set(true);
		component['cluster'].set(mockCluster);
		fixture.detectChanges();
		tick();
		// effect should have patched values
		expect(component['clusterForm'].value.region).toBe('eu-west');
		expect(component['clusterForm'].value.version).toBe('1.28');
		expect(component['clusterForm'].value.nodeCount).toBe(3);
		expect(component['labels'].length).toBe(2);
		expect(component['selectedRegion']()).toEqual(mockCluster.region);
		expect(component['searchVersionModel']()).toBe('1.28');
		expect(component['searchRegionModel']()).toBe('eu-west');
 }));

 it('hydrateClusterData should do nothing when not visible', fakeAsync(() => {
   const mockCluster = {
     id: 'c2',
     name: 'c2',
     nodeCount: 2,
     region: { id: 'r1', code: 'eu-west', name: 'EU West' },
     version: { id: 'v1', version: '1.28' },
     labels: { x: '1' },
   } as any;
   component['regions'].set([mockCluster.region]);
   component['versions'].set([mockCluster.version]);
   // visible remains false
   component['cluster'].set(mockCluster);
   // run change detection/effects
   fixture.detectChanges();
   tick();
   // form should still be default
   expect(component['clusterForm'].value.region).toBe('');
   expect(component['clusterForm'].value.version).toBe('');
   expect(component['labels'].length).toBe(0);
 }));

 // Note: hydrateClusterData is initialized in constructor with action='edit'.
 // We do not re-register it with a different action to avoid conflicting effects.

	it('onHide should reset form state', () => {
		// Pre-populate
		component['clusterForm'].patchValue({
			name: 'abc',
			version: '1.28',
			region: 'eu',
			nodeCount: 5,
		});
		component['labels'].push((component as any)['formBuilder'].control({ key: 'a', value: 'b' }));
		component['selectedRegion'].set({} as any);
		component['searchRegionModel'].set('x');
		component['searchVersionModel'].set('y');

		component['onHide']();

		expect(component['currentStep']()).toBe(1);
		expect(component['labels'].length).toBe(0);
		expect(component['selectedRegion']()).toBeNull();
		expect(component['searchRegionModel']()).toBe('');
		expect(component['searchVersionModel']()).toBe('');
		expect(component['clusterForm'].value.nodeCount).toBe(1);
	});

 it('saveCluster should call createCluster when action is create and emit clusterSaved', () => {
		// arrange data
		fixture.componentRef.setInput('action', 'create');
		component['versions'].set([{ id: 'v1', version: '1.28' } as any]);
		component['regions'].set([{ id: 'rg1', code: 'eu' } as any]);
		component['clusterForm'].patchValue({
			name: 'my-cluster',
			version: '1.28',
			region: 'eu',
			nodeCount: 3,
		});
		const emitSpy = jest.spyOn(component['clusterSaved'], 'emit');

		// call
		component['saveCluster']();

		expect(clustersSvcMock.createCluster).toHaveBeenCalled();
  expect(emitSpy).toHaveBeenCalledWith(true);
    // dialog closed and state reset by closeDialogAndNotify
    expect(component['visible']()).toBe(false);
    expect(component['cluster']()).toBeNull();
  });

 it('saveCluster should call updateCluster when action is edit', () => {
		// default input value is 'edit'
		const emitSpy = jest.spyOn(component['clusterSaved'], 'emit');
		component['saveCluster']();
		expect(clustersSvcMock.updateCluster).toHaveBeenCalled();
		expect(emitSpy).toHaveBeenCalledWith(true);
 });

 it('saveCluster should map labels and set version/region ids when present', () => {
   component['versions'].set([
     { id: 'v1', version: '1.28' },
   ] as any);
   component['regions'].set([
     { id: 'rg1', code: 'eu' },
   ] as any);

   component['clusterForm'].controls.labelInput.patchValue({ key: 'a', value: '1' });
   (component as any)['addLabel']('a', '1');
   component['clusterForm'].patchValue({ version: '1.28', region: 'eu', name: 'n1', nodeCount: 2 });

   component['saveCluster']();
   expect(clustersSvcMock.updateCluster).toHaveBeenCalledWith(
     expect.objectContaining({
       labels: { a: '1' },
       versionId: 'v1',
       regionId: 'rg1',
       name: 'n1',
       nodeCount: 2,
     }),
   );
 });

 it('saveCluster should allow missing lookups (no matching version/region)', () => {
   component['versions'].set([] as any);
   component['regions'].set([] as any);
   component['clusterForm'].patchValue({ version: 'x', region: 'y' });
   component['saveCluster']();
   expect(clustersSvcMock.updateCluster).toHaveBeenCalledWith(
     expect.objectContaining({ versionId: undefined, regionId: undefined }),
   );
 });

 it('searchVersion should handle no matches', () => {
   component['versions'].set([{ id: '1', version: '1.27' }] as any);
   component['searchVersion']({ originalEvent: {} as any, query: '2.0' } as any);
   expect(component['filteredVersions']?.length ?? 0).toBe(0);
 });
});
