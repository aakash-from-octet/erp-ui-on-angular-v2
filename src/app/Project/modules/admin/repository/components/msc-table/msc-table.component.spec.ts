import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MscTableComponent } from './msc-table.component';

describe('MscTableComponent', () => {
  let component: MscTableComponent;
  let fixture: ComponentFixture<MscTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MscTableComponent],
    });
    fixture = TestBed.createComponent(MscTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
