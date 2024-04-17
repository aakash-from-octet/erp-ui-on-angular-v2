import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolepermissionTableComponent } from './rolepermission-table.component';

describe('RolepermissionTableComponent', () => {
  let component: RolepermissionTableComponent;
  let fixture: ComponentFixture<RolepermissionTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RolepermissionTableComponent]
    });
    fixture = TestBed.createComponent(RolepermissionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
