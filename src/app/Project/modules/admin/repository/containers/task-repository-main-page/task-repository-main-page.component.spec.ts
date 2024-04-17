import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskrepositoryMainPageComponent } from './task-repository-main-page.component';

describe('TaskgroupMainPageComponent', () => {
  let component: TaskrepositoryMainPageComponent;
  let fixture: ComponentFixture<TaskrepositoryMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskrepositoryMainPageComponent],
    });
    fixture = TestBed.createComponent(TaskrepositoryMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
