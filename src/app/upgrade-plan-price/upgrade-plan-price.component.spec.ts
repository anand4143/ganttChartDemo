import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradePlanPriceComponent } from './upgrade-plan-price.component';

describe('UpgradePlanPriceComponent', () => {
  let component: UpgradePlanPriceComponent;
  let fixture: ComponentFixture<UpgradePlanPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpgradePlanPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradePlanPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
