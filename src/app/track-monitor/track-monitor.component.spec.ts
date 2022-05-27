import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackMonitorComponent } from './track-monitor.component';

describe('TrackMonitorComponent', () => {
  let component: TrackMonitorComponent;
  let fixture: ComponentFixture<TrackMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackMonitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
