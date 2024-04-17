import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensormasterMainPageComponent } from './sensormaster-main-page.component';

describe('SensormasterMainPageComponent', () => {
  let component: SensormasterMainPageComponent;
  let fixture: ComponentFixture<SensormasterMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SensormasterMainPageComponent],
    });
    fixture = TestBed.createComponent(SensormasterMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
