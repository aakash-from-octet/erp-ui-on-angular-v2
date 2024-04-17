import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentMainPageComponent } from './component-main-page.component';

describe('ComponentMainPageComponent', () => {
  let component: ComponentMainPageComponent;
  let fixture: ComponentFixture<ComponentMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentMainPageComponent],
    });
    fixture = TestBed.createComponent(ComponentMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
