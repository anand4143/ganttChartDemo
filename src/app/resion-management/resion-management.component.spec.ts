import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResionManagementComponent } from './resion-management.component';

describe('ResionManagementComponent', () => {
  let component: ResionManagementComponent;
  let fixture: ComponentFixture<ResionManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResionManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
