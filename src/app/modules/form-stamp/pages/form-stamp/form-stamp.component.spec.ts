import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStampComponent } from './form-stamp.component';

describe('FormStampComponent', () => {
  let component: FormStampComponent;
  let fixture: ComponentFixture<FormStampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
