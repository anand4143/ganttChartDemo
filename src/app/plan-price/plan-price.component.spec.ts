import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPriceComponent } from './plan-price.component';

describe('PlanPriceComponent', () => {
  let component: PlanPriceComponent;
  let fixture: ComponentFixture<PlanPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
