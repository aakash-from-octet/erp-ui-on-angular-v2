import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplaterepositoryTableComponent } from './template-repository-table.component';

describe('TemplaterepositoryTableComponent', () => {
  let component: TemplaterepositoryTableComponent;
  let fixture: ComponentFixture<TemplaterepositoryTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplaterepositoryTableComponent],
    });
    fixture = TestBed.createComponent(TemplaterepositoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
