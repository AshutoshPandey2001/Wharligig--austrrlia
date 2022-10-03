import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyInnerViewComponent } from './policy-inner-view.component';

describe('PolicyInnerViewComponent', () => {
  let component: PolicyInnerViewComponent;
  let fixture: ComponentFixture<PolicyInnerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolicyInnerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyInnerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
