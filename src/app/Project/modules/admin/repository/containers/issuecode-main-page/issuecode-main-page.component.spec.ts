import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuecodeMainPageComponent } from './issuecode-main-page.component';

describe('TaskgroupMainPageComponent', () => {
  let component: IssuecodeMainPageComponent;
  let fixture: ComponentFixture<IssuecodeMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssuecodeMainPageComponent],
    });
    fixture = TestBed.createComponent(IssuecodeMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
