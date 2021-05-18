import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsManagerListComponent } from './trips-manager-list.component';

describe('TripsManagerListComponent', () => {
  let component: TripsManagerListComponent;
  let fixture: ComponentFixture<TripsManagerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripsManagerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsManagerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
