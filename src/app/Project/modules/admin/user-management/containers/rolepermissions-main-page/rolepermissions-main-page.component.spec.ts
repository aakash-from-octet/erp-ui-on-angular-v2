import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolepermissionsMainPageComponent } from './rolepermissions-main-page.component';

describe('RolepermissionsMainPageComponent', () => {
  let component: RolepermissionsMainPageComponent;
  let fixture: ComponentFixture<RolepermissionsMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolepermissionsMainPageComponent]
    });
    fixture = TestBed.createComponent(RolepermissionsMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
