import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouldAssociationsComponent } from './mould-associations.component';

describe('MouldAssociationsComponent', () => {
  let component: MouldAssociationsComponent;
  let fixture: ComponentFixture<MouldAssociationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MouldAssociationsComponent]
    });
    fixture = TestBed.createComponent(MouldAssociationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
