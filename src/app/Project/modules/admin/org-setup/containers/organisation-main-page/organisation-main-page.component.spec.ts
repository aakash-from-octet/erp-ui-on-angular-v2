import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationMainPageComponent } from './organisation-main-page.component';

describe('OrganisationMainPageComponent', () => {
  let component: OrganisationMainPageComponent;
  let fixture: ComponentFixture<OrganisationMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganisationMainPageComponent]
    });
    fixture = TestBed.createComponent(OrganisationMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
