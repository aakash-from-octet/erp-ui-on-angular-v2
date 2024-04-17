import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MscMainPageComponent } from './msc-main-page.component';

describe('MscMainPageComponent', () => {
  let component: MscMainPageComponent;
  let fixture: ComponentFixture<MscMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MscMainPageComponent],
    });
    fixture = TestBed.createComponent(MscMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
