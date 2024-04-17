import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueCodeTableComponent } from './issue-code-table.component';

describe('IssueCodeTableComponent', () => {
  let component: IssueCodeTableComponent;
  let fixture: ComponentFixture<IssueCodeTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IssueCodeTableComponent],
    });
    fixture = TestBed.createComponent(IssueCodeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
