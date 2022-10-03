import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedFormStampComponent } from './assigned-form-stamp.component';

describe('AssignedFormStampComponent', () => {
  let component: AssignedFormStampComponent;
  let fixture: ComponentFixture<AssignedFormStampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedFormStampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedFormStampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
