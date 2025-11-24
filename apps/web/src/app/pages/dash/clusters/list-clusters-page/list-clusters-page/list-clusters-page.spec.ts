import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClustersPage } from './list-clusters-page';

describe('ListClustersPage', () => {
  let component: ListClustersPage;
  let fixture: ComponentFixture<ListClustersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListClustersPage]
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
