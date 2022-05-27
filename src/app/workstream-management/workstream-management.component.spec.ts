import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstreamManagementComponent } from './workstream-management.component';

describe('WorkstreamManagementComponent', () => {
  let component: WorkstreamManagementComponent;
  let fixture: ComponentFixture<WorkstreamManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkstreamManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkstreamManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
