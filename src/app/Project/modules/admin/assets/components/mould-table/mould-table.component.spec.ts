import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouldTableComponent } from './mould-table.component';

describe('MouldTableComponent', () => {
  let component: MouldTableComponent;
  let fixture: ComponentFixture<MouldTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MouldTableComponent],
    });
    fixture = TestBed.createComponent(MouldTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
