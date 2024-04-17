import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensormasterTableComponent } from './sensormaster-table.component';

describe('SensormasterTableComponent', () => {
  let component: SensormasterTableComponent;
  let fixture: ComponentFixture<SensormasterTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SensormasterTableComponent],
    });
    fixture = TestBed.createComponent(SensormasterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
