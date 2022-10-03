import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFormStampComponent } from './my-form-stamp.component';

describe('MyFormStampComponent', () => {
  let component: MyFormStampComponent;
  let fixture: ComponentFixture<MyFormStampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFormStampComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFormStampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
