import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskGroupTableComponent } from './task-group-table.component';

describe('TaskGroupTableComponent', () => {
  let component: TaskGroupTableComponent;
  let fixture: ComponentFixture<TaskGroupTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskGroupTableComponent],
    });
    fixture = TestBed.createComponent(TaskGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
