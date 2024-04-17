import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouldDetailsComponent } from './mould-details.component';

describe('MouldDetailsComponent', () => {
  let component: MouldDetailsComponent;
  let fixture: ComponentFixture<MouldDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MouldDetailsComponent]
    });
    fixture = TestBed.createComponent(MouldDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
