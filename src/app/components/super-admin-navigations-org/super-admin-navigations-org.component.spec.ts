import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminNavigationsOrgComponent } from './super-admin-navigations-org.component';

describe('SuperAdminNavigationsOrgComponent', () => {
  let component: SuperAdminNavigationsOrgComponent;
  let fixture: ComponentFixture<SuperAdminNavigationsOrgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminNavigationsOrgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminNavigationsOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
