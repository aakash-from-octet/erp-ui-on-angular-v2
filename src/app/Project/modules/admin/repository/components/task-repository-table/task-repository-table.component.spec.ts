import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskrepositoryTableComponent } from './task-repository-table.component';

describe('TaskGroupTableComponent', () => {
  let component: TaskrepositoryTableComponent;
  let fixture: ComponentFixture<TaskrepositoryTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskrepositoryTableComponent],
    });
    fixture = TestBed.createComponent(TaskrepositoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
