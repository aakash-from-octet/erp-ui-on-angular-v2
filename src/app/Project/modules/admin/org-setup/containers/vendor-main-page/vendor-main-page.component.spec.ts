import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMainPageComponent } from './vendor-main-page.component';

describe('VendorMainPageComponent', () => {
  let component: VendorMainPageComponent;
  let fixture: ComponentFixture<VendorMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorMainPageComponent]
    });
    fixture = TestBed.createComponent(VendorMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
