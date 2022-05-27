import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccVerificationComponent } from './acc-verification.component';

describe('AccVerificationComponent', () => {
  let component: AccVerificationComponent;
  let fixture: ComponentFixture<AccVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
