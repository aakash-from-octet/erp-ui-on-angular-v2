import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparemasterMainPageComponent } from './sparemaster-main-page.component';

describe('SparemasterMainPageComponent', () => {
  let component: SparemasterMainPageComponent;
  let fixture: ComponentFixture<SparemasterMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SparemasterMainPageComponent],
    });
    fixture = TestBed.createComponent(SparemasterMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
