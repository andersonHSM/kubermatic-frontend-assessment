import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ListClustersPage } from './list-clusters-page';

describe('ListClustersPage', () => {
  let component: ListClustersPage;
  let fixture: ComponentFixture<ListClustersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListClustersPage, RouterTestingModule, HttpClientTestingModule, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    })
    // Override heavy PrimeNG template to focus on component creation only
    .overrideComponent(ListClustersPage, {
      set: { template: '<div>ListClustersPage</div>' },
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListClustersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
