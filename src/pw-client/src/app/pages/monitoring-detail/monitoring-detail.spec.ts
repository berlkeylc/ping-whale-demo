import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringDetail } from './monitoring-detail';

describe('MonitoringDetail', () => {
  let component: MonitoringDetail;
  let fixture: ComponentFixture<MonitoringDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
