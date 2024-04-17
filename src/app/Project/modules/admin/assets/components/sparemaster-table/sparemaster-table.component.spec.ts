import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparemasterTableComponent } from './sparemaster-table.component';

describe('SparemasterTableComponent', () => {
  let component: SparemasterTableComponent;
  let fixture: ComponentFixture<SparemasterTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SparemasterTableComponent],
    });
    fixture = TestBed.createComponent(SparemasterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
