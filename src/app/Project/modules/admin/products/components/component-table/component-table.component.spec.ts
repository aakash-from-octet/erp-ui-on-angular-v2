import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentTableComponent } from './component-table.component';

describe('ComponentTableComponent', () => {
  let component: ComponentTableComponent;
  let fixture: ComponentFixture<ComponentTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentTableComponent],
    });
    fixture = TestBed.createComponent(ComponentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
