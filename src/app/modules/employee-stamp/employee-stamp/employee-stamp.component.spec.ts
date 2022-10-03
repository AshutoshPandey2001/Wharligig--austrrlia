import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeStampComponent } from './employee-stamp.component';

describe('EmployeeStampComponent', () => {
  let component: EmployeeStampComponent;
  let fixture: ComponentFixture<EmployeeStampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeStampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeStampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
