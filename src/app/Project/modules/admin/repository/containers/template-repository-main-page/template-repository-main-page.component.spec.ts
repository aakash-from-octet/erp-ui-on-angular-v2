import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateRepositoryMainPageComponent } from './template-repository-main-page.component';

describe('TaskgroupMainPageComponent', () => {
  let component: TemplateRepositoryMainPageComponent;
  let fixture: ComponentFixture<TemplateRepositoryMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateRepositoryMainPageComponent],
    });
    fixture = TestBed.createComponent(TemplateRepositoryMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
