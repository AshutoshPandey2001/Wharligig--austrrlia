import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNumberVerificationComponent } from './mobile-number-verification.component';

describe('MobileNumberVerificationComponent', () => {
  let component: MobileNumberVerificationComponent;
  let fixture: ComponentFixture<MobileNumberVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileNumberVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileNumberVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
