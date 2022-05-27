import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GctesterComponent } from './gctester.component';

describe('GctesterComponent', () => {
  let component: GctesterComponent;
  let fixture: ComponentFixture<GctesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GctesterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GctesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
