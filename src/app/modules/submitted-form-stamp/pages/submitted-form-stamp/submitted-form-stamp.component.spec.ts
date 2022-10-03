import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedFormStampComponent } from './submitted-form-stamp.component';

describe('SubmittedFormStampComponent', () => {
  let component: SubmittedFormStampComponent;
  let fixture: ComponentFixture<SubmittedFormStampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmittedFormStampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedFormStampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
