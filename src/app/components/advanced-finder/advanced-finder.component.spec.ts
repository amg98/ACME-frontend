import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedfinderComponent } from './advanced-finder.component';

describe('AdvancedfinderComponent', () => {
  let component: AdvancedfinderComponent;
  let fixture: ComponentFixture<AdvancedfinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedfinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedfinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
