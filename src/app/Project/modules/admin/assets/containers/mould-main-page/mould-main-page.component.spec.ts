import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouldMainPageComponent } from './mould-main-page.component';

describe('MouldMainPageComponent', () => {
  let component: MouldMainPageComponent;
  let fixture: ComponentFixture<MouldMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MouldMainPageComponent],
    });
    fixture = TestBed.createComponent(MouldMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
