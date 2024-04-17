import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMainPageComponent } from './product-main-page.component';

describe('ProductMainPageComponent', () => {
  let component: ProductMainPageComponent;
  let fixture: ComponentFixture<ProductMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductMainPageComponent],
    });
    fixture = TestBed.createComponent(ProductMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
