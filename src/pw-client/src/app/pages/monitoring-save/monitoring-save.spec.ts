import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringSave } from './monitoring-save';

describe('MonitoringSave', () => {
  let component: MonitoringSave;
  let fixture: ComponentFixture<MonitoringSave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoringSave]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringSave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
