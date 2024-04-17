import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesMainPageComponent } from './roles-main-page.component';

describe('RolesMainPageComponent', () => {
  let component: RolesMainPageComponent;
  let fixture: ComponentFixture<RolesMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolesMainPageComponent]
    });
    fixture = TestBed.createComponent(RolesMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
