import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePermissionMasterComponent } from './role-permission-master.component';

describe('RolePermissionMasterComponent', () => {
  let component: RolePermissionMasterComponent;
  let fixture: ComponentFixture<RolePermissionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolePermissionMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePermissionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
