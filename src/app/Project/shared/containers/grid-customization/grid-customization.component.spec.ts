import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCustomizationComponent } from './grid-customization.component';

describe('GridCustomizationComponent', () => {
  let component: GridCustomizationComponent;
  let fixture: ComponentFixture<GridCustomizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridCustomizationComponent]
    });
    fixture = TestBed.createComponent(GridCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
