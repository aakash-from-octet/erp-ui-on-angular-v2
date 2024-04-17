import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskgroupMainPageComponent } from './taskgroup-main-page.component';

describe('TaskgroupMainPageComponent', () => {
  let component: TaskgroupMainPageComponent;
  let fixture: ComponentFixture<TaskgroupMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskgroupMainPageComponent],
    });
    fixture = TestBed.createComponent(TaskgroupMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
